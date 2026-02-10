import { useMemo, useState } from "react";
import { Plus, Users, ArrowLeft } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

type MemberRole = "Leader" | "Member";

type Member = {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  joinedAt: string;
  lastActive: string;
};

type Community = {
  id: string;
  name: string;
  description: string;
  criteria?: string;
  memberCount: number;
  userRole: MemberRole;
  members: Member[];
};

// Mock data for communities
const mockCommunities: Community[] = [
  {
    id: "founder-circle",
    name: "Founder Circle",
    description: "A community for founders to share experiences and support each other",
    criteria: "Early-stage founders in the tech space",
    memberCount: 12,
    userRole: "Leader",
    members: [
      {
        id: "1",
        name: "You",
        email: "you@kue.app",
        role: "Leader",
        joinedAt: "2 months ago",
        lastActive: "Just now",
      },
      {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@startup.com",
        role: "Member",
        joinedAt: "1 month ago",
        lastActive: "2 hours ago",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@techco.io",
        role: "Member",
        joinedAt: "3 weeks ago",
        lastActive: "1 day ago",
      },
      {
        id: "4",
        name: "Emily Rodriguez",
        email: "emily@innovate.com",
        role: "Member",
        joinedAt: "2 weeks ago",
        lastActive: "3 hours ago",
      },
    ],
  },
  {
    id: "sales-nyc",
    name: "Sales Leaders in NYC",
    description: "NYC-based sales leaders sharing best practices and networking",
    memberCount: 28,
    userRole: "Member",
    members: [
      {
        id: "1",
        name: "David Park",
        email: "david@salesorg.com",
        role: "Leader",
        joinedAt: "6 months ago",
        lastActive: "1 hour ago",
      },
      {
        id: "2",
        name: "You",
        email: "you@kue.app",
        role: "Member",
        joinedAt: "2 months ago",
        lastActive: "Just now",
      },
      {
        id: "3",
        name: "Jessica Liu",
        email: "jessica@enterprise.com",
        role: "Member",
        joinedAt: "4 months ago",
        lastActive: "5 hours ago",
      },
      {
        id: "4",
        name: "Marcus Williams",
        email: "marcus@growth.io",
        role: "Member",
        joinedAt: "1 month ago",
        lastActive: "2 days ago",
      },
    ],
  },
];

type View = "list" | "detail" | "create";

const Communities = () => {
  const [view, setView] = useState<View>("list");
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communities] = useState<Community[]>(mockCommunities);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<MemberRole | "All">("All");

  const handleSelectCommunity = (community: Community) => {
    setSelectedCommunity(community);
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setSelectedCommunity(null);
    setSearchQuery("");
    setRoleFilter("All");
  };

  const handleCreateCommunity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Community created",
      description: "This is a prototype. Community creation is not fully implemented.",
    });
    setView("list");
  };

  const filteredMembers = useMemo(() => {
    if (!selectedCommunity) return [];
    return selectedCommunity.members.filter((member) => {
      if (roleFilter !== "All" && member.role !== roleFilter) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return member.name.toLowerCase().includes(q) || member.email.toLowerCase().includes(q);
    });
  }, [selectedCommunity, roleFilter, searchQuery]);

  // List View
  if (view === "list") {
    return (
      <AppShell>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Communities
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              Join or create communities to expand your network and collaborate with like-minded professionals.
            </p>
          </div>

          <div className="mb-6">
            <Button onClick={() => setView("create")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create new community
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {communities.map((community) => (
              <Card
                key={community.id}
                className="cursor-pointer border-border/70 hover:border-primary/40 transition-colors"
                onClick={() => handleSelectCommunity(community)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{community.name}</CardTitle>
                      <CardDescription className="mt-2">{community.description}</CardDescription>
                    </div>
                    <Badge variant={community.userRole === "Leader" ? "secondary" : "outline"}>
                      {community.userRole}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{community.memberCount} members</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  // Create View
  if (view === "create") {
    return (
      <AppShell>
        <div className="mx-auto max-w-2xl">
          <Button variant="ghost" onClick={handleBackToList} className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to communities
          </Button>

          <div className="mb-8">
            <h1 className="mb-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
              Create a community
            </h1>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Set up a lightweight community with invites, a member directory, and basic analytics.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community details</CardTitle>
              <CardDescription>Define the basics so members know why they&apos;re here and who it&apos;s for.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleCreateCommunity}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="community-name">
                    Community name
                  </label>
                  <Input
                    id="community-name"
                    name="name"
                    placeholder="e.g. Kue GTM Council, Portfolio CTOs"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="community-description">
                    Description
                  </label>
                  <Textarea
                    id="community-description"
                    name="description"
                    placeholder="What is this community for, and how should members use it?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="community-criteria">
                    Membership criteria (optional)
                  </label>
                  <Textarea
                    id="community-criteria"
                    name="criteria"
                    placeholder="Who should be in this community? (role, stage, company type, etc.)"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit">Create community</Button>
                  <Button type="button" variant="outline" onClick={handleBackToList}>
                    Cancel
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                  This is a prototype — data is local to this session.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  // Detail View
  if (view === "detail" && selectedCommunity) {
    const isLeader = selectedCommunity.userRole === "Leader";

    return (
      <AppShell>
        <div className="mx-auto max-w-6xl">
          <Button variant="ghost" onClick={handleBackToList} className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to communities
          </Button>

          <div className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="mb-2 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
                  {selectedCommunity.name}
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                  {selectedCommunity.description}
                </p>
              </div>
              <Badge variant={isLeader ? "secondary" : "outline"} className="shrink-0">
                {selectedCommunity.userRole}
              </Badge>
            </div>
          </div>

          <div className={`grid gap-6 ${isLeader ? "md:grid-cols-[2fr,1fr]" : ""}`}>
            <div className="space-y-6">
              {/* Member Directory */}
              <Card>
                <CardHeader className="space-y-1.5">
                  <CardTitle className="text-lg">Member directory</CardTitle>
                  <CardDescription>
                    Browse and search all members in {selectedCommunity.name}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      placeholder="Search by name or email"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="sm:flex-1"
                    />
                    <div className="flex gap-1 text-xs">
                      <Button
                        type="button"
                        variant={roleFilter === "All" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setRoleFilter("All")}
                      >
                        All
                      </Button>
                      <Button
                        type="button"
                        variant={roleFilter === "Leader" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setRoleFilter("Leader")}
                      >
                        Leaders
                      </Button>
                      <Button
                        type="button"
                        variant={roleFilter === "Member" ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setRoleFilter("Member")}
                      >
                        Members
                      </Button>
                    </div>
                  </div>

                  {filteredMembers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No members match your current filters.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-card px-3 py-2.5 text-sm"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{member.name}</span>
                              <Badge variant={member.role === "Leader" ? "secondary" : "outline"}>{member.role}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                          <div className="text-right text-xs text-muted-foreground">
                            <div>Joined: {member.joinedAt}</div>
                            <div>Last active: {member.lastActive}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Analytics - Only for Leaders */}
            {isLeader && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community analytics</CardTitle>
                    <CardDescription>Metrics to track your community's performance.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="text-xs text-muted-foreground">Total members</div>
                        <div className="mt-1 text-3xl font-semibold">{selectedCommunity.memberCount}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Acceptance rate</div>
                        <div className="mt-1 text-3xl font-semibold">72%</div>
                        <p className="mt-1 text-xs text-muted-foreground">Simulated for prototype</p>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Active members</div>
                        <div className="mt-1 text-3xl font-semibold">9</div>
                        <p className="mt-1 text-xs text-muted-foreground">Active in last 7 days</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Engagement</span>
                        <span>68% (simulated)</span>
                      </div>
                      <Progress value={68} className="h-1.5 bg-muted" />
                      <p className="text-xs text-muted-foreground">
                        Based on searches, intros, and messages within the community.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  return null;
};

export default Communities;

