import { type Connection } from "@/data/mockData";
import { ArrowRight } from "lucide-react";

interface ConnectionCardProps {
  connection: Connection;
  rank?: number;
}

const ConnectionCard = ({ connection, rank }: ConnectionCardProps) => {
  const { person, type, reasons, sharedCompanies, lastInteraction, path } = connection;

  const strengthLabel = type === "direct" ? "Direct" : type === "indirect" ? "Indirect" : "Weak";
  const strengthClass = type === "direct" ? "connection-direct" : type === "indirect" ? "connection-indirect" : "connection-weak";

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all duration-200 hover:border-primary/20 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1">
            {rank && (
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                #{rank}
              </span>
            )}
            <h3 className="font-serif text-lg leading-tight truncate">
              {person.name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {person.title} · {person.company}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          <span className={`connection-strength-dot ${strengthClass}`} />
          <span className="text-xs text-muted-foreground">{strengthLabel}</span>
        </div>
      </div>

      {/* Intermediary path for indirect connections */}
      {type === "indirect" && path && path.length > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-accent/50 border border-accent px-3 py-2">
          <span className="text-xs text-muted-foreground">Through</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {path.map((intermediary, i) => (
              <span key={intermediary.id} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-muted-foreground/50 text-xs">or</span>}
                <span className="text-xs font-medium text-foreground">
                  {intermediary.name}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  ({intermediary.title})
                </span>
              </span>
            ))}
          </div>
          <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
        </div>
      )}

      {/* Context — visible by default */}
      <div className="mt-4 space-y-2">
        {reasons.map((reason, i) => (
          <p key={i} className="text-sm text-foreground/80 leading-relaxed">
            {reason}
          </p>
        ))}
      </div>

      {(sharedCompanies.length > 0 || lastInteraction) && (
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-3 text-xs text-muted-foreground">
          {sharedCompanies.length > 0 && (
            <span>
              Shared: {sharedCompanies.map((c) => c.name).join(", ")}
            </span>
          )}
          {lastInteraction && (
            <span>
              Last contact:{" "}
              {new Date(lastInteraction).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionCard;
