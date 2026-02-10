import { type WarmPath } from "@/lib/warmPaths";

interface PathVisualizationProps {
  path: WarmPath;
}

const strengthColor = {
  strong: "hsl(var(--primary))",
  moderate: "hsl(var(--connection-indirect))",
  weak: "hsl(var(--connection-weak))",
};

const strengthColorBg = {
  strong: "hsl(var(--primary) / 0.12)",
  moderate: "hsl(var(--connection-indirect) / 0.12)",
  weak: "hsl(var(--connection-weak) / 0.12)",
};

const PathVisualization = ({ path }: PathVisualizationProps) => {
  const nodes = [
    { id: "you", label: "You", sub: "Kue" },
    { id: "connector", label: path.connector.name.split(" ")[0], sub: path.connector.company },
    { id: "target", label: path.target.name.split(" ")[0], sub: path.target.company },
  ];

  const cx = [60, 170, 280];
  const cy = 44;
  const nodeR = 18;
  const color = strengthColor[path.strength];
  const bgColor = strengthColorBg[path.strength];

  return (
    <div className="rounded-lg bg-accent/20 border border-border/40 p-3 mb-3">
      <svg
        viewBox="0 0 340 88"
        className="w-full max-w-[340px] mx-auto"
        aria-label={`Path: You → ${path.connector.name} → ${path.target.name}`}
      >
        {/* Edges */}
        {[0, 1].map((i) => {
          const x1 = cx[i] + nodeR + 2;
          const x2 = cx[i + 1] - nodeR - 2;
          const sw = path.strength === "strong" ? 2.5 : path.strength === "moderate" ? 1.8 : 1.2;
          return (
            <line
              key={i}
              x1={x1}
              y1={cy}
              x2={x2}
              y2={cy}
              stroke={color}
              strokeWidth={sw}
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}

        {/* Arrow heads */}
        {[0, 1].map((i) => {
          const x = cx[i + 1] - nodeR - 4;
          return (
            <polygon
              key={`arr-${i}`}
              points={`${x},${cy} ${x - 6},${cy - 3.5} ${x - 6},${cy + 3.5}`}
              fill={color}
              opacity={0.6}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={node.id}>
            <circle
              cx={cx[i]}
              cy={cy}
              r={nodeR}
              fill={bgColor}
              stroke={color}
              strokeWidth={i === 0 ? 2 : 1.5}
              opacity={i === 0 ? 1 : 0.85}
            />
            <text
              x={cx[i]}
              y={cy + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground"
              fontSize="9"
              fontWeight="500"
            >
              {node.label}
            </text>
            <text
              x={cx[i]}
              y={cy + nodeR + 12}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize="7.5"
              opacity={0.7}
            >
              {node.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default PathVisualization;
