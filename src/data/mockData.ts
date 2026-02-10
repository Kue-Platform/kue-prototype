export interface Person {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
}

export interface EmailRecord {
  id: string;
  from: string;
  to: string;
  date: string;
  subject: string;
}

export interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  attendees: string[];
}

export interface WorkHistory {
  personId: string;
  companyId: string;
  role: string;
  startYear: number;
  endYear: number | null;
}

export interface Connection {
  person: Person;
  type: "direct" | "indirect" | "weak";
  relevanceScore: number;
  reasons: string[];
  path?: Person[];
  sharedCompanies: Company[];
  recentInteractions: number;
  lastInteraction?: string;
}

// The current user
export const currentUser: Person = {
  id: "user-1",
  name: "You",
  title: "Co-founder & CEO",
  company: "Kue",
  email: "you@kue.app",
};

export const people: Person[] = [
  { id: "p-1", name: "Alex Chen", title: "Engineering Lead", company: "Stripe", email: "alex@stripe.com" },
  { id: "p-3", name: "Marcus Johnson", title: "Head of BD", company: "Figma", email: "marcus@figma.com" },
  { id: "p-4", name: "Sara Kim", title: "CTO", company: "Linear", email: "sara@linear.app" },
  { id: "p-5", name: "Ankit Patel", title: "Investor, Partner", company: "Sequoia Capital", email: "ankit@sequoiacap.com" },
  { id: "p-6", name: "Lena Müller", title: "Design Director", company: "Vercel", email: "lena@vercel.com" },
  { id: "p-7", name: "James Wright", title: "CEO", company: "Acme Corp", email: "james@acme.co" },
  { id: "p-8", name: "Olivia Torres", title: "Product Manager", company: "Stripe", email: "olivia@stripe.com" },
  { id: "p-10", name: "Rachel Green", title: "Head of Sales", company: "Linear", email: "rachel@linear.app" },
  { id: "p-11", name: "Tom Nguyen", title: "Co-founder", company: "Kue", email: "tom@kue.app" },

  { id: "p-2", name: "Priya Sharma", title: "VP of Product", company: "Notion", email: "priya@notion.so" },
  { id: "p-9", name: "David Park", title: "Software Engineer", company: "Notion", email: "david@notion.so" },
  { id: "n-1", name: "Ivan Zhao", title: "CEO", company: "Notion", email: "ivan@notion.so" },
  { id: "n-2", name: "Akshay Kothari", title: "COO", company: "Notion", email: "akshay@notion.so" },

  { id: "n-3", name: "Camille Ricketts", title: "Head of Marketing", company: "Notion", email: "camille@notion.so" },
  { id: "n-4", name: "Jake Teton-Landis", title: "Engineering Manager", company: "Notion", email: "jake@notion.so" },
  { id: "n-5", name: "Ravi Mehta", title: "Head of Product", company: "Notion", email: "ravi@notion.so" },
  { id: "n-6", name: "Linus Lee", title: "Software Engineer", company: "Notion", email: "linus@notion.so" },
  { id: "n-7", name: "Emily Zhang", title: "Design Lead", company: "Notion", email: "emily@notion.so" },
  { id: "n-8", name: "Jordan Blake", title: "Head of Sales", company: "Notion", email: "jordan@notion.so" },
  { id: "n-9", name: "Sophie Laurent", title: "Head of Partnerships", company: "Notion", email: "sophie@notion.so" },
  { id: "n-10", name: "Kenji Tanaka", title: "Data Engineer", company: "Notion", email: "kenji@notion.so" },

  { id: "n-11", name: "Mia Chen", title: "Product Designer", company: "Notion", email: "mia@notion.so" },
  { id: "n-12", name: "Arun Gupta", title: "Backend Engineer", company: "Notion", email: "arun@notion.so" },
  { id: "n-13", name: "Taylor Kim", title: "Customer Success Lead", company: "Notion", email: "taylor@notion.so" },
  { id: "n-14", name: "Nina Patel", title: "Content Strategist", company: "Notion", email: "nina@notion.so" },
  { id: "n-15", name: "Chris Morales", title: "Security Engineer", company: "Notion", email: "chris@notion.so" },
  { id: "n-16", name: "Zara Ahmed", title: "Engineering Director", company: "Notion", email: "zara@notion.so" },
  { id: "n-17", name: "Leo Fernandez", title: "Mobile Engineer", company: "Notion", email: "leo@notion.so" },
  { id: "n-18", name: "Hannah Wu", title: "HR Director", company: "Notion", email: "hannah@notion.so" },
  { id: "n-19", name: "Omar Sayed", title: "DevOps Engineer", company: "Notion", email: "omar@notion.so" },
  { id: "n-20", name: "Isabella Rivera", title: "VP of Finance", company: "Notion", email: "isabella@notion.so" },
];

export const companies: Company[] = [
  { id: "c-1", name: "Stripe", domain: "stripe.com" },
  { id: "c-2", name: "Notion", domain: "notion.so" },
  { id: "c-3", name: "Figma", domain: "figma.com" },
  { id: "c-4", name: "Linear", domain: "linear.app" },
  { id: "c-5", name: "Sequoia Capital", domain: "sequoiacap.com" },
  { id: "c-6", name: "Vercel", domain: "vercel.com" },
  { id: "c-7", name: "Acme Corp", domain: "acme.co" },
  { id: "c-8", name: "Kue", domain: "kue.app" },
];

export const emails: EmailRecord[] = [
  { id: "e-1", from: "user-1", to: "p-1", date: "2024-12-15", subject: "Catching up" },
  { id: "e-2", from: "p-1", to: "user-1", date: "2024-12-18", subject: "Re: Catching up" },
  { id: "e-3", from: "user-1", to: "p-1", date: "2025-01-10", subject: "Quick question about APIs" },

  { id: "e-4", from: "user-1", to: "p-2", date: "2025-01-20", subject: "Product feedback" },
  { id: "e-5", from: "p-2", to: "user-1", date: "2025-01-22", subject: "Re: Product feedback" },

  { id: "e-6", from: "user-1", to: "p-5", date: "2025-02-01", subject: "Fundraise update" },
  { id: "e-7", from: "p-5", to: "user-1", date: "2025-02-02", subject: "Re: Fundraise update" },

  { id: "e-8", from: "p-11", to: "p-2", date: "2025-01-28", subject: "Coffee chat" },
  { id: "e-9", from: "p-11", to: "p-3", date: "2025-01-05", subject: "Partnership discussion" },
  { id: "e-10", from: "p-11", to: "p-6", date: "2024-11-20", subject: "Design review" },

  { id: "e-11", from: "user-1", to: "p-8", date: "2025-01-15", subject: "API integration" },
  { id: "e-12", from: "p-8", to: "user-1", date: "2025-01-16", subject: "Re: API integration" },

  { id: "e-13", from: "user-1", to: "p-4", date: "2024-10-05", subject: "How you built Linear" },

  { id: "e-14", from: "p-7", to: "p-5", date: "2025-01-30", subject: "Intro request" },

  { id: "e-15", from: "user-1", to: "n-1", date: "2025-01-05", subject: "Notion API collaboration" },
  { id: "e-16", from: "n-1", to: "user-1", date: "2025-01-07", subject: "Re: Notion API collaboration" },

  { id: "e-17", from: "user-1", to: "n-2", date: "2024-12-10", subject: "Growth strategies" },

  { id: "e-18", from: "p-2", to: "n-3", date: "2025-01-15", subject: "Marketing sync" },
  { id: "e-19", from: "p-2", to: "n-5", date: "2025-01-20", subject: "Product roadmap" },
  { id: "e-20", from: "p-2", to: "n-7", date: "2025-01-25", subject: "Design review" },
  { id: "e-21", from: "p-2", to: "n-8", date: "2025-02-01", subject: "Sales enablement" },

  { id: "e-22", from: "p-9", to: "n-4", date: "2025-01-18", subject: "Sprint planning" },
  { id: "e-23", from: "p-9", to: "n-6", date: "2025-01-22", subject: "Code review" },
  { id: "e-24", from: "p-9", to: "n-10", date: "2025-01-28", subject: "Data pipeline" },

  { id: "e-25", from: "p-11", to: "n-9", date: "2025-01-12", subject: "Partnership opportunities" },
  { id: "e-26", from: "p-11", to: "n-16", date: "2025-01-30", subject: "Eng leadership chat" },

  { id: "e-27", from: "user-1", to: "p-9", date: "2025-01-14", subject: "API docs question" },
  { id: "e-28", from: "p-9", to: "user-1", date: "2025-01-15", subject: "Re: API docs question" },
];

export const meetings: MeetingRecord[] = [
  { id: "m-1", title: "Product sync", date: "2025-01-25", attendees: ["user-1", "p-2", "p-9"] },
  { id: "m-2", title: "Investor check-in", date: "2025-02-03", attendees: ["user-1", "p-5"] },
  { id: "m-3", title: "Customer call", date: "2025-01-18", attendees: ["user-1", "p-7", "p-8"] },
  { id: "m-4", title: "Design review", date: "2025-01-12", attendees: ["user-1", "p-6", "p-11"] },
  { id: "m-5", title: "BD discussion", date: "2025-01-28", attendees: ["p-11", "p-3"] },
  { id: "m-6", title: "Coffee chat", date: "2025-02-05", attendees: ["p-11", "p-2"] },
  { id: "m-7", title: "Technical deep dive", date: "2024-12-20", attendees: ["user-1", "p-1", "p-4"] },
  { id: "m-8", title: "Quarterly sync", date: "2024-11-15", attendees: ["user-1", "p-10", "p-4"] },

  { id: "m-9", title: "Notion API kickoff", date: "2025-01-08", attendees: ["user-1", "n-1", "n-2"] },
  { id: "m-10", title: "Notion product feedback", date: "2025-01-26", attendees: ["user-1", "p-2", "n-5"] },

  { id: "m-11", title: "Notion marketing review", date: "2025-01-30", attendees: ["p-2", "n-3", "n-9"] },

  { id: "m-12", title: "Notion eng standup", date: "2025-02-01", attendees: ["p-9", "n-4", "n-6", "n-10", "n-12"] },
];

export const workHistory: WorkHistory[] = [
  { personId: "user-1", companyId: "c-1", role: "Product Manager", startYear: 2019, endYear: 2021 },
  { personId: "p-1", companyId: "c-1", role: "Senior Engineer", startYear: 2018, endYear: null },
  { personId: "p-8", companyId: "c-1", role: "Product Manager", startYear: 2020, endYear: null },
  { personId: "user-1", companyId: "c-2", role: "Product Lead", startYear: 2021, endYear: 2023 },
  { personId: "p-2", companyId: "c-2", role: "VP Product", startYear: 2020, endYear: null },
  { personId: "p-9", companyId: "c-2", role: "Engineer", startYear: 2021, endYear: null },
  { personId: "p-11", companyId: "c-6", role: "Design Engineer", startYear: 2020, endYear: 2023 },
  { personId: "p-6", companyId: "c-6", role: "Design Director", startYear: 2019, endYear: null },
  { personId: "p-3", companyId: "c-3", role: "Head of BD", startYear: 2021, endYear: null },
  { personId: "p-4", companyId: "c-4", role: "CTO", startYear: 2020, endYear: null },
  { personId: "p-10", companyId: "c-4", role: "Head of Sales", startYear: 2021, endYear: null },
  { personId: "p-5", companyId: "c-5", role: "Partner", startYear: 2015, endYear: null },
  { personId: "p-7", companyId: "c-7", role: "CEO", startYear: 2018, endYear: null },

  { personId: "n-1", companyId: "c-2", role: "CEO", startYear: 2013, endYear: null },
  { personId: "n-2", companyId: "c-2", role: "COO", startYear: 2016, endYear: null },
  { personId: "n-3", companyId: "c-2", role: "Head of Marketing", startYear: 2019, endYear: null },
  { personId: "n-4", companyId: "c-2", role: "Engineering Manager", startYear: 2020, endYear: null },
  { personId: "n-5", companyId: "c-2", role: "Head of Product", startYear: 2021, endYear: null },
  { personId: "n-6", companyId: "c-2", role: "Software Engineer", startYear: 2020, endYear: null },
  { personId: "n-7", companyId: "c-2", role: "Design Lead", startYear: 2021, endYear: null },
  { personId: "n-8", companyId: "c-2", role: "Head of Sales", startYear: 2022, endYear: null },
  { personId: "n-9", companyId: "c-2", role: "Head of Partnerships", startYear: 2020, endYear: null },
  { personId: "n-10", companyId: "c-2", role: "Data Engineer", startYear: 2021, endYear: null },
  { personId: "n-11", companyId: "c-2", role: "Product Designer", startYear: 2022, endYear: null },
  { personId: "n-12", companyId: "c-2", role: "Backend Engineer", startYear: 2021, endYear: null },
  { personId: "n-13", companyId: "c-2", role: "Customer Success Lead", startYear: 2022, endYear: null },
  { personId: "n-14", companyId: "c-2", role: "Content Strategist", startYear: 2023, endYear: null },
  { personId: "n-15", companyId: "c-2", role: "Security Engineer", startYear: 2021, endYear: null },
  { personId: "n-16", companyId: "c-2", role: "Engineering Director", startYear: 2019, endYear: null },
  { personId: "n-17", companyId: "c-2", role: "Mobile Engineer", startYear: 2022, endYear: null },
  { personId: "n-18", companyId: "c-2", role: "HR Director", startYear: 2020, endYear: null },
  { personId: "n-19", companyId: "c-2", role: "DevOps Engineer", startYear: 2021, endYear: null },
  { personId: "n-20", companyId: "c-2", role: "VP of Finance", startYear: 2019, endYear: null },
];
