import { useState } from "react";
import { type Connection } from "@/data/mockData";
import { type WarmPath, findWarmPaths } from "@/lib/warmPaths";
import { getCommunitySignals, getCommunityPath, userCircle } from "@/lib/community";
import ConnectionCard from "./ConnectionCard";
import RankingExplainer from "./RankingExplainer";
import WarmPathSection from "./WarmPathSection";
import WarmIntroDialog from "./WarmIntroDialog";
import CommunitySignals from "./CommunitySignals";
import CommunityPathSection from "./CommunityPathSection";
import TrustedCircleBadge from "./TrustedCircleBadge";
import NetworkGraph from "./NetworkGraph";
import { List, Share2 } from "lucide-react";

interface SearchResultsProps {
  connections: Connection[];
  queryContext: string | null;
  query: string;
}

const SearchResults = ({ connections, queryContext, query }: SearchResultsProps) => {
  const [introPath, setIntroPath] = useState<WarmPath | null>(null);
  const [introOpen, setIntroOpen] = useState(false);
  const [view, setView] = useState<"list" | "graph">("list");

  const handleRequestIntro = (path: WarmPath) => {
    setIntroPath(path);
    setIntroOpen(true);
  };

  if (connections.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-sm">
          No connections found for "{query}".
        </p>
        <p className="text-muted-foreground/60 text-xs mt-1">
          Try a person's name or company.
        </p>
      </div>
    );
  }

  const topConnections = connections.slice(0, 3);
  const remaining = connections.slice(3);

  // Find warm paths for the top result's person
  const topPerson = topConnections[0];
  const warmPaths = topPerson ? findWarmPaths(topPerson.person.id) : [];

  // Community data
  const communitySignals = topPerson ? getCommunitySignals(topPerson.person.id) : [];
  const communityPath = topPerson ? getCommunityPath(topPerson.person.id) : null;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-1">
          {queryContext
            ? `Your connections to ${queryContext}`
            : `Results for "${query}"`}
        </p>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            {connections.length} connection{connections.length !== 1 ? "s" : ""} found
            · ranked by relevance
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView(view === "list" ? "graph" : "list")}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-150"
            >
              {view === "list" ? (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  Visualize Network
                </>
              ) : (
                <>
                  <List className="w-3.5 h-3.5" />
                  List View
                </>
              )}
            </button>
            <RankingExplainer />
          </div>
        </div>
      </div>

      {view === "graph" ? (
        <NetworkGraph connections={connections} />
      ) : (
        <>
          {/* Top 3 */}
          <div className="space-y-3">
            {topConnections.map((c, i) => (
              <ConnectionCard key={c.person.id} connection={c} rank={i + 1} />
            ))}
          </div>

          {/* Warm Paths */}
          {warmPaths.length > 0 && (
            <WarmPathSection paths={warmPaths} onRequestIntro={handleRequestIntro} />
          )}

          {/* Community-backed path */}
          {communityPath && <CommunityPathSection communityPath={communityPath} />}

          {/* Community Signals */}
          {communitySignals.length > 0 && (
            <CommunitySignals signals={communitySignals} />
          )}

          {/* Trusted Circle */}
          <div className="pt-1">
            <TrustedCircleBadge circle={userCircle} />
          </div>

          {/* Remaining */}
          {remaining.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider pt-2">
                Other connections
              </p>
              {remaining.map((c) => (
                <ConnectionCard key={c.person.id} connection={c} />
              ))}
            </div>
          )}
        </>
      )}

      <WarmIntroDialog
        path={introPath}
        open={introOpen}
        onOpenChange={setIntroOpen}
      />
    </div>
  );
};

export default SearchResults;
