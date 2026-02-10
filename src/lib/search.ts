import {
  type Connection,
  type Person,
  currentUser,
  people,
  companies,
  emails,
  meetings,
  workHistory,
} from "@/data/mockData";

function getEmailCount(personId: string, withinDays = 90): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - withinDays);
  return emails.filter(
    (e) =>
      ((e.from === "user-1" && e.to === personId) ||
        (e.from === personId && e.to === "user-1") ||
        (e.from === "p-11" && e.to === personId) ||
        (e.from === personId && e.to === "p-11")) &&
      new Date(e.date) >= cutoff
  ).length;
}

function getLastInteraction(personId: string): string | undefined {
  const allDates: string[] = [];

  emails.forEach((e) => {
    if (
      (e.from === "user-1" && e.to === personId) ||
      (e.from === personId && e.to === "user-1") ||
      (e.from === "p-11" && e.to === personId) ||
      (e.from === personId && e.to === "p-11")
    ) {
      allDates.push(e.date);
    }
  });

  meetings.forEach((m) => {
    if (
      m.attendees.includes(personId) &&
      (m.attendees.includes("user-1") || m.attendees.includes("p-11"))
    ) {
      allDates.push(m.date);
    }
  });

  allDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  return allDates[0];
}

function getSharedCompanies(personId: string) {
  const userCompanies = workHistory
    .filter((w) => w.personId === "user-1")
    .map((w) => w.companyId);
  const personCompanies = workHistory
    .filter((w) => w.personId === personId)
    .map((w) => w.companyId);

  const shared = userCompanies.filter((c) => personCompanies.includes(c));
  return shared.map((cId) => companies.find((c) => c.id === cId)!).filter(Boolean);
}

function buildReasons(person: Person): string[] {
  const reasons: string[] = [];

  // Shared work history
  const userHistory = workHistory.filter((w) => w.personId === "user-1");
  const personHistory = workHistory.filter((w) => w.personId === person.id);

  for (const uh of userHistory) {
    for (const ph of personHistory) {
      if (uh.companyId === ph.companyId) {
        const company = companies.find((c) => c.id === uh.companyId);
        const overlapStart = Math.max(uh.startYear, ph.startYear);
        const overlapEnd = Math.min(uh.endYear ?? 2025, ph.endYear ?? 2025);
        if (overlapStart <= overlapEnd && company) {
          reasons.push(
            `You worked with ${person.name} at ${company.name} (${overlapStart}–${overlapEnd === 2025 ? "present" : overlapEnd}).`
          );
        }
      }
    }
  }

  // Direct emails
  const directEmails = emails.filter(
    (e) =>
      (e.from === "user-1" && e.to === person.id) ||
      (e.from === person.id && e.to === "user-1")
  );
  if (directEmails.length > 0) {
    const recent = directEmails.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    reasons.push(
      `You exchanged ${directEmails.length} email${directEmails.length > 1 ? "s" : ""} — most recently about "${recent.subject}".`
    );
  }

  // Shared meetings
  const sharedMeetings = meetings.filter(
    (m) => m.attendees.includes(person.id) && m.attendees.includes("user-1")
  );
  if (sharedMeetings.length > 0) {
    const recent = sharedMeetings.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
    reasons.push(
      `You were both in "${recent.title}" on ${formatDate(recent.date)}${sharedMeetings.length > 1 ? ` (and ${sharedMeetings.length - 1} other meeting${sharedMeetings.length > 2 ? "s" : ""})` : ""}.`
    );
  }

  // Indirect via cofounder (p-11 = Tom)
  const cofEmails = emails.filter(
    (e) =>
      (e.from === "p-11" && e.to === person.id) ||
      (e.from === person.id && e.to === "p-11")
  );
  const cofMeetings = meetings.filter(
    (m) => m.attendees.includes(person.id) && m.attendees.includes("p-11")
  );

  if (cofEmails.length > 0 || cofMeetings.length > 0) {
    const total = cofEmails.length + cofMeetings.length;
    reasons.push(
      `Your co-founder Tom met ${person.name} ${total} time${total > 1 ? "s" : ""} in recent months.`
    );
  }

  return reasons;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getConnectionType(
  person: Person
): "direct" | "indirect" | "weak" {
  const hasDirectEmail = emails.some(
    (e) =>
      (e.from === "user-1" && e.to === person.id) ||
      (e.from === person.id && e.to === "user-1")
  );
  const hasDirectMeeting = meetings.some(
    (m) => m.attendees.includes(person.id) && m.attendees.includes("user-1")
  );
  const hasSharedCompany = getSharedCompanies(person.id).length > 0;

  if (hasDirectEmail || hasDirectMeeting || hasSharedCompany) return "direct";

  const hasIndirect =
    emails.some(
      (e) =>
        (e.from === "p-11" && e.to === person.id) ||
        (e.from === person.id && e.to === "p-11")
    ) ||
    meetings.some(
      (m) => m.attendees.includes(person.id) && m.attendees.includes("p-11")
    );

  if (hasIndirect) return "indirect";
  return "weak";
}

function computeRelevance(person: Person): number {
  let score = 0;
  const recentCount = getEmailCount(person.id, 90);
  score += recentCount * 15;

  const totalEmails = emails.filter(
    (e) =>
      (e.from === "user-1" && e.to === person.id) ||
      (e.from === person.id && e.to === "user-1")
  ).length;
  score += totalEmails * 5;

  const meetingCount = meetings.filter(
    (m) => m.attendees.includes(person.id) && m.attendees.includes("user-1")
  ).length;
  score += meetingCount * 20;

  score += getSharedCompanies(person.id).length * 25;

  // Recency bonus
  const last = getLastInteraction(person.id);
  if (last) {
    const daysAgo = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
    if (daysAgo < 14) score += 30;
    else if (daysAgo < 30) score += 20;
    else if (daysAgo < 90) score += 10;
  }

  return score;
}

function findIntermediaries(personId: string): Person[] {
  // Find people who connect user-1 to the target person
  const bridges: Person[] = [];
  const directContacts = new Set<string>();

  // People user-1 or p-11 (Tom) have direct contact with
  emails.forEach((e) => {
    if (e.from === "user-1") directContacts.add(e.to);
    if (e.to === "user-1") directContacts.add(e.from);
    if (e.from === "p-11") directContacts.add(e.to);
    if (e.to === "p-11") directContacts.add(e.from);
  });
  meetings.forEach((m) => {
    if (m.attendees.includes("user-1") || m.attendees.includes("p-11")) {
      m.attendees.forEach((a) => directContacts.add(a));
    }
  });

  // Check which of those direct contacts also connect to the target
  directContacts.forEach((contactId) => {
    if (contactId === "user-1" || contactId === "p-11" || contactId === personId) return;
    const connectsToTarget =
      emails.some(
        (e) =>
          (e.from === contactId && e.to === personId) ||
          (e.from === personId && e.to === contactId)
      ) ||
      meetings.some(
        (m) => m.attendees.includes(contactId) && m.attendees.includes(personId)
      );
    if (connectsToTarget) {
      const person = people.find((p) => p.id === contactId);
      if (person) bridges.push(person);
    }
  });

  return bridges;
}

function buildConnection(person: Person): Connection {
  const type = getConnectionType(person);
  const path = type === "indirect" ? findIntermediaries(person.id) : undefined;
  return {
    person,
    type,
    relevanceScore: computeRelevance(person),
    reasons: buildReasons(person),
    path,
    sharedCompanies: getSharedCompanies(person.id),
    recentInteractions: getEmailCount(person.id, 90),
    lastInteraction: getLastInteraction(person.id),
  };
}

export function searchConnections(query: string): Connection[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  let matchedPeople: Person[] = [];

  // Check if querying about a company
  const companyMatch = companies.find(
    (c) =>
      q.includes(c.name.toLowerCase()) || q.includes(c.domain.toLowerCase())
  );

  if (companyMatch) {
    // Find all people at that company
    const peopleAtCompany = workHistory
      .filter((w) => w.companyId === companyMatch.id && w.personId !== "user-1")
      .map((w) => people.find((p) => p.id === w.personId)!)
      .filter(Boolean);
    matchedPeople = [...new Set(peopleAtCompany)];
  }

  // Check if querying about a person
  const personMatch = people.filter((p) =>
    p.name.toLowerCase().includes(q.replace(/[^a-z ]/g, "").trim()) ||
    q.includes(p.name.toLowerCase().split(" ")[0])
  );

  if (personMatch.length > 0) {
    matchedPeople = [...new Set([...matchedPeople, ...personMatch])];
  }

  // Fallback: broad search across names, titles, companies
  if (matchedPeople.length === 0) {
    matchedPeople = people.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.company.toLowerCase().includes(q)
    );
  }

  // If still nothing, check common query patterns
  if (matchedPeople.length === 0) {
    // "who do i know" → return top connections
    if (q.includes("who") || q.includes("anyone") || q.includes("connected")) {
      matchedPeople = people.filter((p) => p.id !== "p-11");
    }
  }

  // Filter out the cofounder from results (they're part of "you")
  matchedPeople = matchedPeople.filter((p) => p.id !== "p-11");

  const connections = matchedPeople.map(buildConnection);

  // Filter out people with no connection at all
  const filtered = connections.filter(
    (c) => c.reasons.length > 0 || c.relevanceScore > 0
  );

  // Sort by relevance
  filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return filtered;
}

export function getQueryContext(query: string): string | null {
  const q = query.toLowerCase();
  const companyMatch = companies.find(
    (c) => q.includes(c.name.toLowerCase()) || q.includes(c.domain.toLowerCase())
  );
  if (companyMatch) return companyMatch.name;

  const personMatch = people.find((p) =>
    q.includes(p.name.toLowerCase().split(" ")[0]) && p.id !== "p-11"
  );
  if (personMatch) return personMatch.name;

  return null;
}
