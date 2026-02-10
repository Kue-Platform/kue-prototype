import { useState } from "react";
import { Linkedin, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface Connector {
  id: string;
  name: string;
  category: string;
  connected: boolean;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const connectors: Connector[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    category: "Social",
    connected: false,
    description: "Layer in public graph data to complement your private relationship graph.",
    icon: Linkedin,
  },
  {
    id: "google",
    name: "Google",
    category: "Mails",
    connected: true,
    description: "Messaging app for business that connects people to the information they need.",
    icon: Mail,
  },
  {
    id: "outlook",
    name: "Outlook",
    category: "Mails",
    connected: false,
    description: "Free communications app that lets you share voice, video, and text chat.",
    icon: Mail,
  },
];

const Integrations = () => {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnectors = connectors.filter((connector) => {
    const matchesSearch = connector.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleRequestSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string | null) ?? "";

    toast({
      title: "Connector request recorded",
      description: name
        ? `We've noted your interest in a ${name} connector. This is a prototype only.`
        : "We've noted your connector request. This is a prototype only.",
    });

    form.reset();
    setShowRequestForm(false);
  };

  const handleConnectClick = (connectorName: string) => {
    toast({
      title: "Connection initiated",
      description: `Connecting to ${connectorName}... This is a prototype.`,
    });
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-normal text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Select and connect tools you use to integrate with your workflow.
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 flex justify-end">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64"
            />
          </div>
        </div>

        {/* Integrations List */}
        <div className="space-y-0 rounded-lg border border-border bg-card">
          {filteredConnectors.map((connector, index) => {
            const Icon = connector.icon;
            return (
              <div
                key={connector.id}
                className={`flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-muted/50 ${
                  index !== filteredConnectors.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{connector.name}</h3>
                    <p className="text-sm text-muted-foreground">{connector.description}</p>
                  </div>
                </div>
                {connector.connected ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="shrink-0"
                    disabled
                  >
                    Connected
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="shrink-0"
                    onClick={() => handleConnectClick(connector.name)}
                  >
                    Connect
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Request Connector Button */}
        {!showRequestForm && (
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={() => setShowRequestForm(true)}
              className="w-full sm:w-auto"
            >
              Request a connector
            </Button>
          </div>
        )}

        {/* Request Form */}
        {showRequestForm && (
          <div className="mt-6 rounded-lg border border-border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-foreground">Request a new connector</h2>
              <p className="text-sm text-muted-foreground">
                Don't see a system your team relies on? Tell us what you'd like us to support next.
              </p>
            </div>
            <form className="space-y-4" onSubmit={handleRequestSubmit}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="connector-name">
                  Connector name
                </label>
                <Input
                  id="connector-name"
                  name="name"
                  placeholder="e.g. Pipedrive, Zoho, Apollo"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground" htmlFor="connector-details">
                  What would you use it for?
                </label>
                <Textarea
                  id="connector-details"
                  name="details"
                  placeholder="Optional: share a bit about your workflow so we can prioritize the right data."
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Request connector</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                This is a prototype. Requests stay in this demo and won't actually be sent anywhere yet.
              </p>
            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
};

export default Integrations;
