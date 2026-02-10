import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ChevronDown, Group, Mail, Plus, Users } from "lucide-react";

import SearchBox from "@/components/SearchBox";
import SearchResults from "@/components/SearchResults";
import LoadingState from "@/components/LoadingState";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { getQueryContext, searchConnections } from "@/lib/search";
import { currentUser, emails, meetings, people, type Connection } from "@/data/mockData";

type SearchConnectorId = "email" | "calendar" | "friends" | "founder-circle" | "sales-nyc";

type SearchConnector = {
  id: SearchConnectorId;
  label: string;
  description: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
};

function formatCount(count: number): string {
  if (count >= 1000) {
    const value = count / 1000;
    return `${value.toFixed(value >= 10 ? 0 : 1)}K`;
  }
  return `${count}`;
}

function getEmailConnectionCount(): number {
  const connections = new Set<string>();
  emails.forEach((e) => {
    if (e.from === "user-1") connections.add(e.to);
    if (e.to === "user-1") connections.add(e.from);
  });
  return connections.size;
}

function getCalendarConnectionCount(): number {
  const connections = new Set<string>();
  meetings.forEach((m) => {
    if (m.attendees.includes("user-1")) {
      m.attendees.forEach((id) => {
        if (id !== "user-1") connections.add(id);
      });
    }
  });
  return connections.size;
}

function getFriendsConnectionCount(): number {
  const domain = currentUser.email.split("@")[1] ?? "";
  if (!domain) return 0;
  const kueUsers = people.filter(
    (person) => person.email.endsWith(`@${domain}`) || person.company === currentUser.company,
  );
  return kueUsers.length;
}

function usesEmailConnector(personId: string): boolean {
  return emails.some(
    (e) =>
      (e.from === "user-1" && e.to === personId) ||
      (e.to === "user-1" && e.from === personId),
  );
}

function usesCalendarConnector(personId: string): boolean {
  return meetings.some((m) => m.attendees.includes("user-1") && m.attendees.includes(personId));
}

function usesFriendsConnector(personEmail: string, personCompany: string): boolean {
  const domain = currentUser.email.split("@")[1] ?? "";
  if (!domain) return false;
  return personEmail.endsWith(`@${domain}`) || personCompany === currentUser.company;
}

function filterConnectionsByConnectors(
  connections: Connection[],
  selected: SearchConnectorId[],
): Connection[] {
  if (selected.length === 0) return connections;
  const selectedSet = new Set<SearchConnectorId>(selected);

  return connections.filter((connection) => {
    const { id, email, company } = connection.person;
    const viaEmail = usesEmailConnector(id);
    const viaCalendar = usesCalendarConnector(id);
    const viaFriends = usesFriendsConnector(email, company);

    const sources: SearchConnectorId[] = [];
    if (viaEmail) sources.push("email");
    if (viaCalendar) sources.push("calendar");
    if (viaFriends) sources.push("friends");

    if (sources.length === 0) {
      // If we can't attribute the connection to a specific connector, keep it.
      return true;
    }

    return sources.some((source) => selectedSet.has(source));
  });
}

const Index = () => {
  const [results, setResults] = useState<Connection[] | null>(null);
  const [query, setQuery] = useState("");
  const [queryContext, setQueryContext] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedConnectors, setSelectedConnectors] = useState<SearchConnectorId[]>([
    "email",
    "calendar",
    "friends",
    "founder-circle",
    "sales-nyc",
  ]);
  const [isConnectorPanelOpen, setIsConnectorPanelOpen] = useState(false);

  const connectors = useMemo<SearchConnector[]>(
    () => [
      {
        id: "email",
        label: "Email",
        description: "Gmail / Google Workspace",
        count: getEmailConnectionCount(),
        icon: Mail,
      },
      {
        id: "calendar",
        label: "Calendar",
        description: "Google Calendar",
        count: getCalendarConnectionCount(),
        icon: CalendarDays,
      },
      {
        id: "friends",
        label: "Friends",
        description: "People already on Kue",
        count: getFriendsConnectionCount(),
        icon: Users,
      },
    ],
    [],
  );

  const communities = useMemo<SearchConnector[]>(
    () => [
      {
        id: "founder-circle",
        label: "Founder Circle",
        description: "Community of founders",
        count: 12,
        icon: Group,
      },
      {
        id: "sales-nyc",
        label: "Sales Leaders in NYC",
        description: "NYC-based sales leaders",
        count: 28,
        icon: Group,
      },
    ],
    [],
  );

  const handleToggleConnector = useCallback((id: SearchConnectorId) => {
    setSelectedConnectors((current) => {
      const isActive = current.includes(id);
      if (isActive) {
        // Keep at least one connector selected.
        if (current.length === 1) return current;
        return current.filter((c) => c !== id);
      }
      return [...current, id];
    });
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setQueryContext(getQueryContext(q));
      setResults(null);
      setLoading(true);

      const delay = 1500 + Math.random() * 1500; // 1.5–3s
      setTimeout(() => {
        const allConnections = searchConnections(q);
        const filtered = filterConnectionsByConnectors(allConnections, selectedConnectors);
        setResults(filtered);
        setLoading(false);
      }, delay);
    },
    [selectedConnectors],
  );

  const handleReset = useCallback(() => {
    setResults(null);
    setQuery("");
    setQueryContext(null);
    setLoading(false);
  }, []);

  const isHome = results === null && !loading;

  return (
    <AppShell>
      {isHome ? (
        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <div className="w-full max-w-lg text-center">
            <h1 className="mb-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              Who are you connected to?
            </h1>
            <p className="mb-10 text-base text-muted-foreground">
              Search a person or company to see how you're connected — and why.
            </p>
            <SearchBox
              onSearch={handleSearch}
              isHome
              connectorButton={
                <div className="relative inline-block">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 rounded-full bg-background px-3 text-xs shadow-sm"
                    onClick={() => setIsConnectorPanelOpen((open) => !open)}
                  >
                    <span>Searching your network</span>
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>

                  {isConnectorPanelOpen && (
                    <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-border/70 bg-card/95 p-3 text-xs shadow-lg backdrop-blur z-50">
                      <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground">Search filters</span>
                        <span className="text-[10px] uppercase tracking-wide">Sources</span>
                      </div>

                      {/* Connectors Section */}
                      <div className="mb-3">
                        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Connectors
                        </div>
                        <div className="space-y-1.5">
                          {connectors.map((connector) => {
                            const Icon = connector.icon;
                            const isActive = selectedConnectors.includes(connector.id);
                            return (
                              <button
                                key={connector.id}
                                type="button"
                                onClick={() => handleToggleConnector(connector.id)}
                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left hover:bg-muted/80 ${
                                  isActive ? "bg-muted" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="h-3.5 w-3.5" />
                                  <span>{connector.label}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatCount(connector.count)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Communities Section */}
                      <div className="mb-2 border-t border-border/60 pt-2">
                        <div className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Communities
                        </div>
                        <div className="space-y-1.5">
                          {communities.map((community) => {
                            const Icon = community.icon;
                            const isActive = selectedConnectors.includes(community.id);
                            return (
                              <button
                                key={community.id}
                                type="button"
                                onClick={() => handleToggleConnector(community.id)}
                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left hover:bg-muted/80 ${
                                  isActive ? "bg-muted" : ""
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="h-3.5 w-3.5" />
                                  <span className="truncate">{community.label}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatCount(community.count)}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-border/60 pt-2">
                        <Button
                          asChild
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 w-full justify-start gap-1.5 rounded-lg px-2 text-[11px] text-muted-foreground hover:text-foreground"
                        >
                          <Link to="/integrations">
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add new connector</span>
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              }
            />
          </div>
        </div>
      ) : loading ? (
        <div className="mx-auto max-w-xl py-8">
          <LoadingState />
        </div>
      ) : (
        <div className="mx-auto max-w-2xl animate-fade-in py-8">
          <SearchResults connections={results!} queryContext={queryContext} query={query} />
        </div>
      )}
    </AppShell>
  );
};

export default Index;
