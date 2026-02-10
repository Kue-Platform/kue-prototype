import { type Person, people, companies, workHistory } from "@/data/mockData";

// --- Trusted Circle ---

export interface TrustedCircle {
  id: string;
  name: string;
  memberCount: number;
  description: string;
}

export const userCircle: TrustedCircle = {
  id: "circle-1",
  name: "Founders Circle",
  memberCount: 12,
  description: "Early-stage founders sharing connection signals",
};

// --- Community Signal ---

export interface CommunitySignal {
  type: "people_know" | "common_intro" | "frequent_connection";
  message: string;
}

// --- Community Path ---

export interface CommunityPath {
  targetId: string;
  available: boolean;
  message: string;
  respondents?: number;
}

// Deterministic hash for consistent mock data
function simpleHash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getCommunitySignals(personId: string): CommunitySignal[] {
  const person = people.find((p) => p.id === personId);
  if (!person) return [];

  const hash = simpleHash(personId);
  const signals: CommunitySignal[] = [];

  // "N people in your network know someone here"
  const companyId = workHistory.find((w) => w.personId === personId)?.companyId;
  const companyName = companyId
    ? companies.find((c) => c.id === companyId)?.name
    : person.company;

  const networkCount = 2 + (hash % 5); // 2–6
  if (companyName) {
    signals.push({
      type: "people_know",
      message: `${networkCount} people in your circle know someone at ${companyName}`,
    });
  }

  // "Commonly introduced via X"
  const introTypes = ["founders", "investors", "former colleagues", "design leaders"];
  const introType = introTypes[hash % introTypes.length];
  if (hash % 3 !== 0) {
    signals.push({
      type: "common_intro",
      message: `Commonly introduced via ${introType}`,
    });
  }

  // "Frequently connected through Company X"
  const bridgeCompanies = companies.filter(
    (c) => c.id !== companyId && c.name !== "Kue"
  );
  if (hash % 4 < 3 && bridgeCompanies.length > 0) {
    const bridge = bridgeCompanies[hash % bridgeCompanies.length];
    signals.push({
      type: "frequent_connection",
      message: `Frequently connected through ${bridge.name}`,
    });
  }

  return signals.slice(0, 3);
}

export function getCommunitySignalsForCompany(companyName: string): CommunitySignal[] {
  const hash = simpleHash(companyName);
  const signals: CommunitySignal[] = [];

  const count = 3 + (hash % 6);
  signals.push({
    type: "people_know",
    message: `${count} people in your circle know someone at ${companyName}`,
  });

  const introTypes = ["founders", "investors", "product leaders", "engineers"];
  signals.push({
    type: "common_intro",
    message: `Commonly introduced via ${introTypes[hash % introTypes.length]}`,
  });

  return signals;
}

export function getCommunityPath(targetId: string): CommunityPath | null {
  const hash = simpleHash(targetId);
  // ~60% chance a community path exists
  if (hash % 5 < 2) return null;

  const person = people.find((p) => p.id === targetId);
  if (!person) return null;

  return {
    targetId,
    available: true,
    message: `Someone in your circle has successfully connected to ${person.name} before.`,
    respondents: 1 + (hash % 2),
  };
}

export function requestCommunityIntro(targetId: string): {
  status: "open" | "responded";
  message: string;
} {
  const hash = simpleHash(targetId);
  // Simulate: some targets get a response
  if (hash % 3 === 0) {
    return {
      status: "responded",
      message: "1 person is open to helping",
    };
  }
  return {
    status: "open",
    message: "No one responded yet",
  };
}
