import {
  type Person,
  people,
  emails,
  meetings,
  workHistory,
  companies,
} from "@/data/mockData";

export interface WarmPath {
  connector: Person;
  target: Person;
  strength: "strong" | "moderate" | "weak";
  reason: string;
  confidence: string;
  relationshipType: string;
}

function getInteractionCount(a: string, b: string): number {
  const emailCount = emails.filter(
    (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a)
  ).length;
  const meetingCount = meetings.filter(
    (m) => m.attendees.includes(a) && m.attendees.includes(b)
  ).length;
  return emailCount + meetingCount;
}

function getLastInteractionDate(a: string, b: string): Date | null {
  const dates: Date[] = [];
  emails.forEach((e) => {
    if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) {
      dates.push(new Date(e.date));
    }
  });
  meetings.forEach((m) => {
    if (m.attendees.includes(a) && m.attendees.includes(b)) {
      dates.push(new Date(m.date));
    }
  });
  dates.sort((a, b) => b.getTime() - a.getTime());
  return dates[0] || null;
}

function sharedCompanyNames(a: string, b: string): string[] {
  const aCompanies = workHistory.filter((w) => w.personId === a).map((w) => w.companyId);
  const bCompanies = workHistory.filter((w) => w.personId === b).map((w) => w.companyId);
  const shared = aCompanies.filter((c) => bCompanies.includes(c));
  return shared.map((cId) => companies.find((c) => c.id === cId)?.name ?? "").filter(Boolean);
}

function buildPathReason(connector: Person, target: Person, viaUser: boolean): string {
  const connectorTargetInteractions = getInteractionCount(connector.id, target.id);
  const shared = sharedCompanyNames(connector.id, target.id);
  const lastDate = getLastInteractionDate(connector.id, target.id);

  const parts: string[] = [];

  if (viaUser) {
    const userConnectorShared = sharedCompanyNames("user-1", connector.id);
    if (userConnectorShared.length > 0) {
      parts.push(`You worked with ${connector.name} at ${userConnectorShared[0]}`);
    } else {
      parts.push(`You've been in touch with ${connector.name}`);
    }
  } else {
    parts.push(`Your co-founder Tom knows ${connector.name}`);
  }

  if (shared.length > 0) {
    parts.push(`${connector.name} worked with ${target.name} at ${shared[0]}`);
  }

  if (connectorTargetInteractions > 0 && lastDate) {
    const daysAgo = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo < 30) {
      parts.push(`and they connected recently`);
    } else if (daysAgo < 90) {
      parts.push(`and met in the last quarter`);
    }
  }

  return parts.join(", ") + ".";
}

function buildConfidence(connector: Person, target: Person): { strength: WarmPath["strength"]; confidence: string } {
  const interactions = getInteractionCount(connector.id, target.id);
  const lastDate = getLastInteractionDate(connector.id, target.id);
  const shared = sharedCompanyNames(connector.id, target.id);
  const daysAgo = lastDate ? Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)) : 999;

  if ((interactions >= 2 && daysAgo < 60) || shared.length > 0) {
    return {
      strength: "strong",
      confidence: "This path is strong because the relationship is recent and direct.",
    };
  }
  if (interactions >= 1 || daysAgo < 120) {
    return {
      strength: "moderate",
      confidence: "This path is viable — there's a real connection, though less recent.",
    };
  }
  return {
    strength: "weak",
    confidence: "This path exists but may require more context before reaching out.",
  };
}

function getRelationshipType(connector: Person, target: Person): string {
  const shared = sharedCompanyNames(connector.id, target.id);
  if (shared.length > 0) return `Former colleagues at ${shared[0]}`;
  const meetingCount = meetings.filter(
    (m) => m.attendees.includes(connector.id) && m.attendees.includes(target.id)
  ).length;
  if (meetingCount > 0) return "Met in shared meetings";
  const emailCount = emails.filter(
    (e) =>
      (e.from === connector.id && e.to === target.id) ||
      (e.from === target.id && e.to === connector.id)
  ).length;
  if (emailCount > 0) return "Email correspondence";
  return "Professional contact";
}

export function findWarmPaths(targetPersonId: string): WarmPath[] {
  const target = people.find((p) => p.id === targetPersonId);
  if (!target) return [];

  const paths: WarmPath[] = [];

  // Find connectors: people who know both the user (or co-founder) AND the target
  const potentialConnectors = people.filter(
    (p) => p.id !== "user-1" && p.id !== targetPersonId && p.id !== "p-11"
  );

  for (const connector of potentialConnectors) {
    // Check if connector knows the target
    const connectorTargetCount = getInteractionCount(connector.id, targetPersonId);
    const connectorTargetShared = sharedCompanyNames(connector.id, targetPersonId);
    const knowsTarget = connectorTargetCount > 0 || connectorTargetShared.length > 0;

    if (!knowsTarget) continue;

    // Check if user knows the connector
    const userConnectorCount = getInteractionCount("user-1", connector.id);
    const userConnectorShared = sharedCompanyNames("user-1", connector.id);
    const viaUser = userConnectorCount > 0 || userConnectorShared.length > 0;

    // Check if co-founder knows the connector
    const cofConnectorCount = getInteractionCount("p-11", connector.id);
    const viaCof = cofConnectorCount > 0;

    if (!viaUser && !viaCof) continue;

    const { strength, confidence } = buildConfidence(connector, target);

    paths.push({
      connector,
      target,
      strength,
      reason: buildPathReason(connector, target, viaUser),
      confidence,
      relationshipType: getRelationshipType(connector, target),
    });
  }

  // Sort: strong first, then moderate, then weak
  const order = { strong: 0, moderate: 1, weak: 2 };
  paths.sort((a, b) => order[a.strength] - order[b.strength]);

  return paths;
}

export function generateIntroDraft(
  connector: Person,
  target: Person
): string {
  return `Hey ${connector.name.split(" ")[0]} — I noticed you've worked with ${target.name} before.\nI'm exploring a conversation with ${target.name.split(" ")[0]} and wanted to see if you'd be comfortable making an intro.\nTotally fine if not.`;
}
