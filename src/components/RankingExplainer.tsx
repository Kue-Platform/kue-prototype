import { useState } from "react";
import { Info, X } from "lucide-react";

const signals = [
  {
    label: "Recency",
    description: "How recently you interacted with this person — more recent means more relevant.",
  },
  {
    label: "Frequency",
    description: "How often you've exchanged emails or been in meetings together.",
  },
  {
    label: "Shared context",
    description: "Whether you've worked at the same company, attended the same meetings, or share mutual contacts.",
  },
  {
    label: "Directness",
    description: "Whether the connection is through you directly, or through someone on your team.",
  },
];

const RankingExplainer = () => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
        How this is ranked
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-serif text-base">How connections are ranked</h4>
        <button
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Kue looks at your existing work data to surface the most relevant connections. Nothing is inferred or guessed.
      </p>
      <ul className="space-y-3">
        {signals.map((s) => (
          <li key={s.label} className="flex gap-3">
            <span className="w-1 h-1 rounded-full bg-primary/50 mt-2 shrink-0" />
            <div>
              <span className="text-sm font-medium text-foreground">{s.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RankingExplainer;
