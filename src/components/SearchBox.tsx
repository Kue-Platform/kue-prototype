import { useCallback, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "Who do I know at Stripe?",
  "How am I connected to Ankit?",
  "Anyone at Notion?",
  "Show me connections at Linear",
];

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isHome?: boolean;
  connectorButton?: React.ReactNode;
}

const SearchBox = ({ onSearch, isHome = false, connectorButton }: SearchBoxProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) onSearch(query.trim());
    },
    [query, onSearch]
  );

  const handleSuggestion = useCallback(
    (s: string) => {
      setQuery(s);
      onSearch(s);
    },
    [onSearch]
  );

  return (
    <div className={isHome ? "w-full" : "w-full"}>
      <div className="relative">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <div className={`kue-search-input flex items-center gap-2 pl-11 pr-3 ${connectorButton ? 'pb-14' : ''}`}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a person, company, or ask a question…"
              className="flex-1 border-none bg-transparent p-0 text-base outline-none placeholder:text-muted-foreground"
              autoFocus={isHome}
            />
          </div>
        </form>

        {/* Connector button at bottom-left of search container */}
        {connectorButton && (
          <div className="absolute left-4 bottom-3">
            {connectorButton}
          </div>
        )}
      </div>

      {isHome && (
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors duration-150"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
