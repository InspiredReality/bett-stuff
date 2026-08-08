import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useForceGraphData } from '@/hooks/useForceGraphData'
import styles from './ForceGraph.module.css'

const SOURCE_NODE_IDS = [
  'Front_Gate_Dragon', 'Sportins_Squad', 'Munchin’_🐱',
  'OBtoshi_Nakamoto', 'The_Deshaun_Rub_Down', 'King_Of_The_North',
  'Chili_Cheese_Burritos', 'Lord_of_Lakengren',
  'Michaels_Neat_Team', 'Broken_Football'
]

const TEAM_COLOR_MAP = {
  Front_Gate_Dragon: '#502616',
  Sportins_Squad: '#e6070c',
  'Munchin’_🐱': '#c54037',
  OBtoshi_Nakamoto: '#ac7a3f',
  The_Deshaun_Rub_Down: '#cd7b6f',
  King_Of_The_North: '#f07029',
  Chili_Cheese_Burritos: '#e3b464',
  Lord_of_Lakengren: '#8226f7',
  Michaels_Neat_Team: '#c3c6cd',
  Broken_Football: '#000000'
}

export default function ForceGraph() {
  const containerRef = useRef(null)
  const { nodes, links, loaded } = useForceGraphData()

  useEffect(() => {
    if (!loaded || !containerRef.current) return

    // Work on copies — d3-force mutates node/link objects in place.
    const nodesCopy = nodes.map((n) => ({ ...n }))
    const linksCopy = links.map((l) => ({ ...l }))

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    nodesCopy.forEach((n) => (n.isSource = SOURCE_NODE_IDS.includes(n.id)))

    const nodeColorMap = {}
    nodesCopy.forEach((n) => {
      if (TEAM_COLOR_MAP[n.id]) nodeColorMap[n.id] = TEAM_COLOR_MAP[n.id]
    })
    linksCopy.forEach((l) => {
      const targetId = typeof l.target === 'string' ? l.target : l.target.id
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id
      if (!nodeColorMap[targetId]) nodeColorMap[targetId] = nodeColorMap[sourceId]
    })

    const nodeDegrees = {}
    linksCopy.forEach((l) => {
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id
      nodeDegrees[sourceId] = (nodeDegrees[sourceId] || 0) + 1
    })

    const sortedSourceIds = [...SOURCE_NODE_IDS].sort(
      (a, b) => (nodeDegrees[b] || 0) - (nodeDegrees[a] || 0)
    )

    const radiusScale = d3
      .scaleLinear()
      .domain([1, d3.max(Object.values(nodeDegrees)) ?? 1])
      .range([5, 60])

    nodesCopy.forEach((n) => {
      n.degree = nodeDegrees[n.id] || 0
      n.radius = n.isSource ? radiusScale(n.degree) : 20
    })

    const rows = [0.2, 0.5, 0.8]
    const rowCounts = [2, 3, 5]
    let rowIndex = 0
    let currentRowCount = 0
    sortedSourceIds.forEach((sourceId) => {
      const node = nodesCopy.find((n) => n.id === sourceId)
      if (!node) return
      node.targetY = height * rows[rowIndex]
      const spacing = width / (rowCounts[rowIndex] + 1)
      node.targetX = spacing * (currentRowCount + 1)
      currentRowCount++
      if (currentRowCount >= rowCounts[rowIndex]) {
        rowIndex++
        currentRowCount = 0
      }
    })

    d3.select(containerRef.current).select('svg').remove()
    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('width', '100%')
      .style('height', '100%')
      .style('display', 'block')

    svg
      .append('defs')
      .selectAll('clipPath')
      .data(nodesCopy.filter((d) => d.imageUrl && d.isSource))
      .join('clipPath')
      .attr('id', (d) => `clip-${d.id}`)
      .append('circle')
      .attr('r', (d) => d.radius)
      .attr('cx', 0)
      .attr('cy', 0)

    const simulation = d3
      .forceSimulation(nodesCopy)
      .force('link', d3.forceLink(linksCopy)
        .id((d) => d.id).distance(30).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-20))
      .force('collision', d3.forceCollide((d) => d.radius + 5))
      .force('x', d3.forceX((d) => (d.isSource ? d.targetX : width / 2))
        .strength((d) => (d.isSource ? 0.5 : 0.05)))
      .force('y', d3.forceY((d) => (d.isSource ? d.targetY : height / 2))
        .strength((d) => (d.isSource ? 0.5 : 0.05)))

    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(linksCopy)
      .join('line')
      .attr('stroke-width', (d) => Math.sqrt(d.value || 1))

    const nodeGroup = svg
      .append('g')
      .selectAll('g')
      .data(nodesCopy)
      .join('g')
      .call(drag(simulation))

    nodeGroup.each(function (d) {
      const sel = d3.select(this)
      if (d.imageUrl && d.isSource) {
        sel.append('image')
          .attr('href', d.imageUrl)
          .attr('width', d.radius * 2)
          .attr('height', d.radius * 2)
          .attr('x', -d.radius)
          .attr('y', -d.radius)
          .attr('clip-path', `url(#clip-${d.id})`)
      } else {
        sel.append('circle')
          .attr('r', d.radius)
          .attr('fill', nodeColorMap[d.id] || '#cccccc')
      }
      sel.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '.35em')
        .text(d.display)
        .style('pointer-events', 'none')
        .style('fill', 'white')
        .style('font-size', `${Math.min(d.radius * 0.6, 12)}px`)
    })

    // Bounds nodes are clamped to while dragging. Starts as the full
    // container box; narrowed once the simulation settles and the view
    // is fit tightly to the actual node spread (see 'end' below), so a
    // dragged node can never be pulled outside the visible viewBox.
    const clampBounds = { minX: 0, minY: 0, maxX: width, maxY: height }

    simulation.on('tick', () => {
      const buffer = 5

      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y)

      nodeGroup.attr('transform', (d) => {
        d.x = Math.max(clampBounds.minX + d.radius, Math.min(clampBounds.maxX - d.radius - buffer, d.x))
        d.y = Math.max(clampBounds.minY + d.radius, Math.min(clampBounds.maxY - d.radius - buffer, d.y))
        return `translate(${d.x},${d.y})`
      })
    })

    // The layout's row-target math (and the physics settling around it)
    // doesn't reliably spread nodes flush to every edge, which can leave
    // an empty margin on one side. Once the simulation cools, crop the
    // view to the actual bounding box of the settled nodes and stretch it
    // to fill the container exactly, so there's never dead space — then
    // re-fit after every drag-triggered re-settle for the same reason.
    const PAD = 6
    simulation.on('end', () => {
      const minX = Math.min(...nodesCopy.map((d) => d.x - d.radius)) - PAD
      const maxX = Math.max(...nodesCopy.map((d) => d.x + d.radius)) + PAD
      const minY = Math.min(...nodesCopy.map((d) => d.y - d.radius)) - PAD
      const maxY = Math.max(...nodesCopy.map((d) => d.y + d.radius)) + PAD

      svg
        .attr('viewBox', `${minX} ${minY} ${maxX - minX} ${maxY - minY}`)
        .attr('preserveAspectRatio', 'none')

      clampBounds.minX = minX
      clampBounds.minY = minY
      clampBounds.maxX = maxX
      clampBounds.maxY = maxY
    })

    function drag(sim) {
      function started(event, d) {
        if (!event.active) sim.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      }
      function dragged(event, d) {
        d.fx = event.x
        d.fy = event.y
      }
      function ended(event, d) {
        if (!event.active) sim.alphaTarget(0)
        d.fx = null
        d.fy = null
      }
      return d3.drag().on('start', started).on('drag', dragged).on('end', ended)
    }

    // Cleanup: stop the simulation and clear the SVG on unmount / re-run —
    // React's effect can re-fire (StrictMode double-invoke, tab switches),
    // so leftover simulations/DOM must be torn down explicitly.
    return () => {
      simulation.stop()
      d3.select(containerRef.current).select('svg').remove()
    }
  }, [loaded, nodes, links])

  return <div ref={containerRef} className={styles.graph} />
}
