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

    let simulation = null

    function build(width, height) {
      if (width <= 0 || height <= 0) return

      // Work on copies — d3-force mutates node/link objects in place.
      const nodesCopy = nodes.map((n) => ({ ...n }))
      const linksCopy = links.map((l) => ({ ...l }))

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

      const rows = [0.15, 0.5, 0.85]
      const rowCounts = [2, 3, 5]
      let rowIndex = 0
      let currentRowCount = 0
      sortedSourceIds.forEach((sourceId) => {
        const node = nodesCopy.find((n) => n.id === sourceId)
        if (!node) return
        node.targetY = height * rows[rowIndex]
        // Spread targets across the FULL width (first at 0%, last at 100%) —
        // the per-node radius-aware clamp in the tick handler is what keeps
        // any node from actually overflowing the edge, so aiming targets at
        // the true edges (rather than leaving a built-in margin here) is
        // what lets the layout fill the container instead of clustering in.
        node.targetX = rowCounts[rowIndex] > 1
          ? (width * currentRowCount) / (rowCounts[rowIndex] - 1)
          : width / 2
        currentRowCount++
        if (currentRowCount >= rowCounts[rowIndex]) {
          rowIndex++
          currentRowCount = 0
        }
      })

      // Pull each week-result bubble toward its OWN team's row position
      // instead of the container's global center — otherwise every
      // satellite node (the vast majority of the graph) has a constant
      // pull toward the middle, which drags clusters belonging to edge-row
      // teams inward and leaves the true edges empty.
      const sourceTargetById = {}
      nodesCopy.forEach((n) => {
        if (n.isSource) sourceTargetById[n.id] = { x: n.targetX, y: n.targetY }
      })
      const satelliteTarget = {}
      linksCopy.forEach((l) => {
        const sourceId = typeof l.source === 'string' ? l.source : l.source.id
        const targetId = typeof l.target === 'string' ? l.target : l.target.id
        if (sourceTargetById[sourceId]) satelliteTarget[targetId] = sourceTargetById[sourceId]
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

      simulation = d3
        .forceSimulation(nodesCopy)
        .force('link', d3.forceLink(linksCopy)
          .id((d) => d.id).distance(30).strength(0.5))
        .force('charge', d3.forceManyBody().strength(-20))
        .force('collision', d3.forceCollide((d) => d.radius + 5))
        .force('x', d3.forceX((d) => (d.isSource ? d.targetX : satelliteTarget[d.id]?.x ?? width / 2))
          .strength((d) => (d.isSource ? 0.5 : 0.1)))
        .force('y', d3.forceY((d) => (d.isSource ? d.targetY : satelliteTarget[d.id]?.y ?? height / 2))
          .strength((d) => (d.isSource ? 0.5 : 0.1)))

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

      // Nodes are clamped to the container box on every tick, using each
      // node's own radius — this is what actually prevents overflow, so
      // the target math above can safely aim at the true edges. The
      // viewBox itself is set once per build and never touched again, so
      // the frame never "jumps" as the simulation settles or gets dragged.
      simulation.on('tick', () => {
        link
          .attr('x1', (d) => d.source.x)
          .attr('y1', (d) => d.source.y)
          .attr('x2', (d) => d.target.x)
          .attr('y2', (d) => d.target.y)

        nodeGroup.attr('transform', (d) => {
          d.x = Math.max(d.radius, Math.min(width - d.radius, d.x))
          d.y = Math.max(d.radius, Math.min(height - d.radius, d.y))
          return `translate(${d.x},${d.y})`
        })
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
    }

    build(containerRef.current.clientWidth, containerRef.current.clientHeight)

    // Mobile browsers resize the visual viewport as toolbars show/hide, and
    // the container can settle to its final size a frame after mount. Rerun
    // the whole build (fresh measurement, fresh simulation) whenever the
    // container's actual box changes size, so the graph never stays locked
    // to a stale/incorrect width — this only fires on real size changes,
    // never mid-settle, so it doesn't reintroduce the "jumpy" resize.
    let resizeTimeout = null
    let lastWidth = containerRef.current.clientWidth
    let lastHeight = containerRef.current.clientHeight
    const resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (Math.round(width) === lastWidth && Math.round(height) === lastHeight) return
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        lastWidth = Math.round(width)
        lastHeight = Math.round(height)
        if (simulation) simulation.stop()
        build(lastWidth, lastHeight)
      }, 150)
    })
    resizeObserver.observe(containerRef.current)

    // Cleanup: stop the simulation, drop the observer, and clear the SVG on
    // unmount / re-run — React's effect can re-fire (StrictMode
    // double-invoke, tab switches), so leftover state must be torn down.
    return () => {
      clearTimeout(resizeTimeout)
      resizeObserver.disconnect()
      if (simulation) simulation.stop()
      d3.select(containerRef.current).select('svg').remove()
    }
  }, [loaded, nodes, links])

  return <div ref={containerRef} className={styles.graph} />
}
