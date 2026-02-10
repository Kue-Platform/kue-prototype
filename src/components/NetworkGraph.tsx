import { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import { type Connection, currentUser, people } from "@/data/mockData";
import NodePreview from "./NodePreview";

interface NetworkGraphProps {
  connections: Connection[];
}

interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  title: string;
  company: string;
  type: "user" | "direct" | "indirect" | "weak";
  relevanceScore: number;
}

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  strength: "direct" | "indirect" | "weak";
  value: number;
}

const roleCategories: Record<string, string> = {
  Engineering: "hsl(172, 35%, 42%)",
  Product: "hsl(35, 55%, 55%)",
  Design: "hsl(280, 35%, 55%)",
  Business: "hsl(210, 45%, 50%)",
  Leadership: "hsl(350, 45%, 55%)",
  Investor: "hsl(145, 35%, 45%)",
};

function getRoleCategory(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("engineer") || t.includes("cto") || t.includes("software")) return "Engineering";
  if (t.includes("product")) return "Product";
  if (t.includes("design")) return "Design";
  if (t.includes("bd") || t.includes("sales")) return "Business";
  if (t.includes("investor") || t.includes("partner") || t.includes("capital")) return "Investor";
  if (t.includes("ceo") || t.includes("co-founder") || t.includes("head") || t.includes("vp") || t.includes("director") || t.includes("lead")) return "Leadership";
  return "Leadership";
}

const NetworkGraph = ({ connections }: NetworkGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  const buildGraphData = useCallback(() => {
    const nodes: GraphNode[] = [
      {
        id: currentUser.id,
        name: currentUser.name,
        title: currentUser.title,
        company: currentUser.company,
        type: "user",
        relevanceScore: 100,
      },
    ];

    const links: GraphLink[] = [];

    connections.forEach((c) => {
      nodes.push({
        id: c.person.id,
        name: c.person.name,
        title: c.person.title,
        company: c.person.company,
        type: c.type,
        relevanceScore: c.relevanceScore,
      });

      links.push({
        source: currentUser.id,
        target: c.person.id,
        strength: c.type,
        value: c.type === "direct" ? 3 : c.type === "indirect" ? 2 : 1,
      });

      // Add intermediary links for indirect connections
      if (c.type === "indirect" && c.path && c.path.length > 0) {
        c.path.forEach((intermediary) => {
          if (!nodes.find((n) => n.id === intermediary.id)) {
            nodes.push({
              id: intermediary.id,
              name: intermediary.name,
              title: intermediary.title,
              company: intermediary.company,
              type: "indirect",
              relevanceScore: 30,
            });
          }
        });
      }
    });

    return { nodes, links };
  }, [connections]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const { nodes, links } = buildGraphData();

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    // Zoom
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Initial center
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2));

    // Force simulation
    const simulation = d3
      .forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        d3.forceLink<GraphNode, GraphLink>(links)
          .id((d) => d.id)
          .distance((d) => (d.strength === "direct" ? 80 : d.strength === "indirect" ? 130 : 180))
      )
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(0, 0))
      .force("collision", d3.forceCollide().radius(35));

    simulationRef.current = simulation;

    // Links
    const link = g
      .append("g")
      .selectAll<SVGLineElement, GraphLink>("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) =>
        d.strength === "direct"
          ? "hsl(172, 35%, 42%)"
          : d.strength === "indirect"
          ? "hsl(35, 40%, 55%)"
          : "hsl(220, 10%, 70%)"
      )
      .attr("stroke-width", (d) => d.value * 1.5)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-dasharray", (d) => (d.strength === "weak" ? "4,4" : "none"));

    // Node groups
    const node = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .call(
        d3.drag<SVGGElement, GraphNode>()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Node circles
    node
      .append("circle")
      .attr("r", (d) => (d.type === "user" ? 22 : 12 + Math.min(d.relevanceScore / 15, 8)))
      .attr("fill", (d) =>
        d.type === "user" ? "hsl(172, 30%, 38%)" : roleCategories[getRoleCategory(d.title)] || "hsl(220, 10%, 50%)"
      )
      .attr("stroke", "hsl(40, 20%, 98%)")
      .attr("stroke-width", (d) => (d.type === "user" ? 3 : 2))
      .attr("opacity", 1);

    // Labels
    node
      .append("text")
      .text((d) => (d.type === "user" ? "You" : d.name.split(" ")[0]))
      .attr("text-anchor", "middle")
      .attr("dy", (d) => (d.type === "user" ? 36 : 28))
      .attr("font-size", (d) => (d.type === "user" ? "12px" : "11px"))
      .attr("font-family", "var(--font-sans)")
      .attr("fill", "hsl(220, 15%, 15%)")
      .attr("font-weight", (d) => (d.type === "user" ? "600" : "400"))
      .attr("pointer-events", "none");

    // Click handler
    node.on("click", (event, d) => {
      if (d.type === "user") return;
      event.stopPropagation();
      const svgRect = svgRef.current!.getBoundingClientRect();
      setPreviewPos({
        x: event.clientX - svgRect.left,
        y: event.clientY - svgRect.top,
      });
      setSelectedNode(d);
    });

    // Click background to dismiss
    svg.on("click", () => setSelectedNode(null));

    // Hover effects
    node
      .on("mouseenter", function (event, d) {
        d3.select(this).select("circle").transition().duration(150).attr("stroke-width", 4);
        // Dim unconnected
        const connectedIds = new Set<string>();
        connectedIds.add(d.id);
        links.forEach((l) => {
          const src = typeof l.source === "object" ? (l.source as GraphNode).id : String(l.source);
          const tgt = typeof l.target === "object" ? (l.target as GraphNode).id : String(l.target);
          if (src === d.id) connectedIds.add(tgt);
          if (tgt === d.id) connectedIds.add(src);
        });
        node.select("circle").attr("opacity", (n: any) => (connectedIds.has(n.id) ? 1 : 0.2));
        node.select("text").attr("opacity", (n: any) => (connectedIds.has(n.id) ? 1 : 0.2));
        link.attr("stroke-opacity", (l: any) => {
          const src = typeof l.source === "object" ? l.source.id : l.source;
          const tgt = typeof l.target === "object" ? l.target.id : l.target;
          return src === d.id || tgt === d.id ? 0.8 : 0.1;
        });
      })
      .on("mouseleave", function () {
        d3.select(this).select("circle").transition().duration(150).attr("stroke-width", (d: any) => (d.type === "user" ? 3 : 2));
        const filteredRole = activeFilter;
        node.select("circle").attr("opacity", (n: any) =>
          filteredRole ? (getRoleCategory(n.title) === filteredRole || n.type === "user" ? 1 : 0.15) : 1
        );
        node.select("text").attr("opacity", (n: any) =>
          filteredRole ? (getRoleCategory(n.title) === filteredRole || n.type === "user" ? 1 : 0.15) : 1
        );
        link.attr("stroke-opacity", 0.5);
      });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [buildGraphData, activeFilter]);

  // Apply filter visually
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGCircleElement, GraphNode>("circle").attr("opacity", (d) => {
      if (d.type === "user") return 1;
      if (!activeFilter) return 1;
      return getRoleCategory(d.title) === activeFilter ? 1 : 0.15;
    });
    svg.selectAll<SVGTextElement, GraphNode>("text").attr("opacity", (d) => {
      if (d.type === "user") return 1;
      if (!activeFilter) return 1;
      return getRoleCategory(d.title) === activeFilter ? 1 : 0.15;
    });
  }, [activeFilter]);

  const categories = Object.keys(roleCategories);
  const connection = selectedNode
    ? connections.find((c) => c.person.id === selectedNode.id)
    : null;

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveFilter(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors duration-150 ${
            activeFilter === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(activeFilter === cat ? null : cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors duration-150 flex items-center gap-1.5 ${
              activeFilter === cat
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: roleCategories[cat] }}
            />
            {cat}
          </button>
        ))}
      </div>

      {/* Graph */}
      <div
        ref={containerRef}
        className="relative w-full rounded-xl border border-border bg-card overflow-hidden"
        style={{ height: "420px" }}
      >
        <svg ref={svgRef} className="w-full h-full" />

        {/* Node preview popover */}
        {selectedNode && connection && (
          <NodePreview
            connection={connection}
            position={previewPos}
            onClose={() => setSelectedNode(null)}
          />
        )}

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] text-muted-foreground bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/50">
          <span className="flex items-center gap-1">
            <span className="w-6 h-[2px] bg-[hsl(172,35%,42%)]" /> Direct
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-[2px] bg-[hsl(35,40%,55%)]" /> Indirect
          </span>
          <span className="flex items-center gap-1">
            <span className="w-6 h-[2px] border-t border-dashed border-[hsl(220,10%,70%)]" /> Weak
          </span>
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground/50">
          Scroll to zoom · Drag to pan
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
