import { useState } from "react";
import { type WarmPath, generateIntroDraft } from "@/lib/warmPaths";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield, Check } from "lucide-react";

interface WarmIntroDialogProps {
  path: WarmPath | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "draft" | "sent" | "accepted";

const WarmIntroDialog = ({ path, open, onOpenChange }: WarmIntroDialogProps) => {
  const [step, setStep] = useState<Step>("draft");
  const [draft, setDraft] = useState("");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && path) {
      setDraft(generateIntroDraft(path.connector, path.target));
      setStep("draft");
    }
    onOpenChange(isOpen);
  };

  const handleSend = () => {
    setStep("sent");
    // Simulate connector accepting after 2s
    setTimeout(() => setStep("accepted"), 2000);
  };

  if (!path) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {step === "draft" && "Request a warm intro"}
            {step === "sent" && "Request sent"}
            {step === "accepted" && "Intro accepted"}
          </DialogTitle>
          <DialogDescription>
            {step === "draft" &&
              `Ask ${path.connector.name} to introduce you to ${path.target.name}.`}
            {step === "sent" &&
              `Waiting for ${path.connector.name} to respond…`}
            {step === "accepted" &&
              `${path.connector.name} agreed to make the intro.`}
          </DialogDescription>
        </DialogHeader>

        {step === "draft" && (
          <div className="space-y-4">
            <div className="flex items-start gap-2 rounded-lg bg-accent/50 p-3">
              <Shield className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                This intro will only be sent if {path.connector.name.split(" ")[0]} agrees. They can decline — no pressure, no awkwardness.
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">
                Draft message to {path.connector.name.split(" ")[0]}
              </label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="w-full rounded-lg border border-border bg-background p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40 transition-all"
                rows={5}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSend}>
                Send request
              </Button>
            </div>
          </div>
        )}

        {step === "sent" && (
          <div className="py-6 text-center">
            <div className="flex gap-1.5 justify-center mb-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {path.connector.name.split(" ")[0]} will see your request and can choose to accept or decline.
            </p>
          </div>
        )}

        {step === "accepted" && (
          <div className="py-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="w-5 h-5 text-primary" />
            </div>
            <p className="text-sm text-foreground">
              {path.connector.name.split(" ")[0]} will introduce you to {path.target.name}.
            </p>
            <p className="text-xs text-muted-foreground">
              This is a simulated response for the prototype.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mt-2"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WarmIntroDialog;
