import { type CommunitySignal } from "@/lib/community";
import { Users } from "lucide-react";

interface CommunitySignalsProps {
  signals: CommunitySignal[];
}

const signalIcon = {
  people_know: "○",
  common_intro: "◇",
  frequent_connection: "△",
};

const CommunitySignals = ({ signals }: CommunitySignalsProps) => {
  if (signals.length === 0) return null;

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Community signals
        </span>
      </div>

      <div className="space-y-2">
        {signals.map((signal, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-[10px] text-muted-foreground/60 mt-0.5 leading-none select-none">
              {signalIcon[signal.type]}
            </span>
            <p className="text-sm text-foreground/70 leading-snug">
              {signal.message}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-muted-foreground/50 mt-3 italic">
        Signals are anonymized and aggregated from your trusted circle.
      </p>
    </div>
  );
};

export default CommunitySignals;
