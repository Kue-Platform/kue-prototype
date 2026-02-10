import { type WarmPath } from "@/lib/warmPaths";
import { ArrowRight } from "lucide-react";
import PathVisualization from "./PathVisualization";

interface WarmPathSectionProps {
  paths: WarmPath[];
  onRequestIntro: (path: WarmPath) => void;
}

const strengthLabel = {
  strong: "Strong path",
  moderate: "Moderate path",
  weak: "Possible path",
};

const strengthDot = {
  strong: "bg-primary",
  moderate: "bg-[hsl(var(--connection-indirect))]",
  weak: "bg-[hsl(var(--connection-weak))]",
};

const WarmPathSection = ({ paths, onRequestIntro }: WarmPathSectionProps) => {
  if (paths.length === 0) return null;

  const bestPath = paths[0];
  const alternativePaths = paths.slice(1, 3);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-serif text-lg mb-0.5">Warm paths</h3>
        <p className="text-xs text-muted-foreground">
          How you could reach {bestPath.target.name} through people you know.
        </p>
      </div>

      {/* Best path */}
      <div className="rounded-xl border border-primary/20 bg-accent/30 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`w-2 h-2 rounded-full ${strengthDot[bestPath.strength]}`} />
          <span className="text-xs font-medium text-accent-foreground uppercase tracking-wider">
            Best path
          </span>
        </div>

        <PathVisualization path={bestPath} />

        <p className="text-sm text-foreground/80 mb-2">{bestPath.reason}</p>
        <p className="text-xs text-muted-foreground italic mb-4">
          {bestPath.confidence}
        </p>

        <button
          onClick={() => onRequestIntro(bestPath)}
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Request warm intro →
        </button>
      </div>

      {/* Alternative paths */}
      {alternativePaths.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Alternative paths
          </p>
          {alternativePaths.map((path) => (
            <div
              key={path.connector.id}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${strengthDot[path.strength]}`} />
                <span className="text-xs text-muted-foreground">
                  {strengthLabel[path.strength]} · {path.relationshipType}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2 text-sm text-foreground">
                <span>You</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{path.connector.name}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span>{path.target.name}</span>
              </div>

              <p className="text-sm text-foreground/70 mb-1">{path.reason}</p>
              <p className="text-xs text-muted-foreground italic mb-3">
                {path.confidence}
              </p>

              <button
                onClick={() => onRequestIntro(path)}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Request warm intro →
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WarmPathSection;
