import { useEffect, useState } from 'react'

export function useForceGraphData() {
  const [nodes, setNodes] = useState([])
  const [links, setLinks] = useState([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch('/nodes/panda-nodes.json').then((r) => r.json()),
      fetch('/nodes/panda-links.json').then((r) => r.json())
    ]).then(([nodesJson, linksJson]) => {
      if (cancelled) return
      setNodes(nodesJson)
      setLinks(linksJson)
      setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { nodes, links, loaded }
}
