import { type TrustedCircle } from "@/lib/community";
import { Shield } from "lucide-react";

interface TrustedCircleBadgeProps {
  circle: TrustedCircle;
}

const TrustedCircleBadge = ({ circle }: TrustedCircleBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-accent/30 px-3 py-2">
      <Shield className="w-3.5 h-3.5 text-primary" />
      <div className="flex flex-col">
        <span className="text-xs font-medium text-foreground">
          {circle.name}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {circle.memberCount} members · sharing connection signals
        </span>
      </div>
    </div>
  );
};

export default TrustedCircleBadge;
