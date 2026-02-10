import { type Connection } from "@/data/mockData";
import { X } from "lucide-react";

interface NodePreviewProps {
  connection: Connection;
  position: { x: number; y: number };
  onClose: () => void;
}

const NodePreview = ({ connection, position, onClose }: NodePreviewProps) => {
  const { person, type, reasons, sharedCompanies, lastInteraction } = connection;
  const strengthLabel = type === "direct" ? "Direct" : type === "indirect" ? "Through your team" : "Weak";
  const strengthClass = type === "direct" ? "connection-direct" : type === "indirect" ? "connection-indirect" : "connection-weak";

  // Position the preview so it doesn't overflow
  const style: React.CSSProperties = {
    position: "absolute",
    left: Math.min(position.x + 12, 280),
    top: Math.max(position.y - 60, 8),
    maxWidth: "260px",
    zIndex: 50,
  };

  return (
    <div
      style={style}
      className="rounded-xl border border-border bg-popover shadow-lg p-4 animate-fade-in"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h4 className="font-serif text-base leading-tight">{person.name}</h4>
          <p className="text-xs text-muted-foreground">
            {person.title} · {person.company}
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <span className={`connection-strength-dot ${strengthClass}`} />
        <span className="text-[11px] text-muted-foreground">{strengthLabel}</span>
      </div>

      <div className="space-y-1.5 mb-3">
        {reasons.slice(0, 2).map((reason, i) => (
          <p key={i} className="text-xs text-foreground/80 leading-relaxed">
            {reason}
          </p>
        ))}
      </div>

      {(sharedCompanies.length > 0 || lastInteraction) && (
        <div className="pt-2 border-t border-border/50 text-[11px] text-muted-foreground space-y-0.5">
          {sharedCompanies.length > 0 && (
            <p>Shared: {sharedCompanies.map((c) => c.name).join(", ")}</p>
          )}
          {lastInteraction && (
            <p>
              Last contact:{" "}
              {new Date(lastInteraction).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NodePreview;
