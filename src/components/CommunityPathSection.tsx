import { useState } from "react";
import { type CommunityPath, requestCommunityIntro } from "@/lib/community";
import { Users, ArrowRight } from "lucide-react";

interface CommunityPathSectionProps {
  communityPath: CommunityPath;
}

const CommunityPathSection = ({ communityPath }: CommunityPathSectionProps) => {
  const [introRequested, setIntroRequested] = useState(false);
  const [introResult, setIntroResult] = useState<{
    status: "open" | "responded";
    message: string;
  } | null>(null);

  const handleAskCommunity = () => {
    setIntroRequested(true);
    // Simulate a short delay
    setTimeout(() => {
      setIntroResult(requestCommunityIntro(communityPath.targetId));
    }, 1500);
  };

  return (
    <div className="rounded-xl border border-primary/10 bg-accent/20 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-3.5 h-3.5 text-primary/70" />
        <span className="text-xs font-medium text-accent-foreground uppercase tracking-wider">
          Community-backed path
        </span>
      </div>

      <p className="text-sm text-foreground/80 mb-3">
        {communityPath.message}
      </p>

      {!introRequested ? (
        <div className="space-y-3">
          <button
            onClick={handleAskCommunity}
            className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5"
          >
            Ask community for guidance
            <ArrowRight className="w-3 h-3" />
          </button>

          <p className="text-[11px] text-muted-foreground/50 italic">
            This will ask if anyone in your trusted circle is open to making an
            intro. No names are shared unless someone opts in.
          </p>
        </div>
      ) : !introResult ? (
        <div className="flex items-center gap-2 py-2">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            Checking with your circle…
          </span>
        </div>
      ) : (
        <div className="rounded-lg bg-card border border-border/60 p-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                introResult.status === "responded"
                  ? "bg-primary"
                  : "bg-muted-foreground/30"
              }`}
            />
            <span className="text-sm text-foreground/80">
              {introResult.message}
            </span>
          </div>
          {introResult.status === "responded" && (
            <p className="text-[11px] text-muted-foreground/50 mt-2 italic">
              They'll reach out when ready. No pressure, no awkwardness.
            </p>
          )}
          {introResult.status === "open" && (
            <p className="text-[11px] text-muted-foreground/50 mt-2 italic">
              We'll let you know if someone responds.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityPathSection;
