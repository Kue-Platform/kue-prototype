import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { currentUser, emails, meetings, people } from "@/data/mockData";

const kueDomain = currentUser.email.split("@")[1] ?? "kue.app";

const kueUsers = people.filter(
  (person) => person.email.endsWith(`@${kueDomain}`) || person.company === currentUser.company,
);

const getInteractionStats = (personId: string) => {
  const emailThreads = emails.filter(
    (e) =>
      (e.from === currentUser.id && e.to === personId) ||
      (e.to === currentUser.id && e.from === personId),
  ).length;

  const sharedMeetings = meetings.filter(
    (m) => m.attendees.includes(currentUser.id) && m.attendees.includes(personId),
  ).length;

  return { emailThreads, sharedMeetings };
};

const Friends = () => {
  const handleInviteExisting = (name: string) => {
    toast({
      title: "Invite sent (prototype)",
      description: `In a real product, we’d email ${name} with an invite to join your Kue workspace.`,
    });
  };

  const handleInviteNew = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string | null) ?? "";

    toast({
      title: "Friend invite recorded",
      description: email
        ? `We’d send an invite to ${email} in a real environment.`
        : "We’d send an invite in a real environment.",
    });

    form.reset();
  };

  return (
    <AppShell>
      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr),minmax(0,1.4fr)]">
        <div>
          <h1 className="mb-3 font-serif text-3xl tracking-tight text-foreground md:text-4xl">
            Friends at Kue
          </h1>
          <p className="mb-6 max-w-xl text-sm text-muted-foreground md:text-base">
            See teammates who already use Kue and how strongly you&apos;re connected, so you know who to loop in for
            intros and context.
          </p>

          {kueUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              We don&apos;t see any other Kue users in this mock dataset yet.
            </p>
          ) : (
            <div className="space-y-4">
              {kueUsers.map((person) => {
                const { emailThreads, sharedMeetings } = getInteractionStats(person.id);
                const hasSignal = emailThreads > 0 || sharedMeetings > 0;

                return (
                  <Card key={person.id} className="border-border/70">
                    <CardHeader className="flex flex-row items-start justify-between gap-4">
                      <div className="space-y-1.5">
                        <CardTitle className="text-base md:text-lg">{person.name}</CardTitle>
                        <CardDescription>
                          {person.title} · {person.company}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {hasSignal ? (
                            <>
                              {emailThreads > 0 && (
                                <span>
                                  {emailThreads} email thread{emailThreads > 1 ? "s" : ""}
                                </span>
                              )}
                              {sharedMeetings > 0 && (
                                <span>
                                  {sharedMeetings} shared meeting{sharedMeetings > 1 ? "s" : ""}
                                </span>
                              )}
                            </>
                          ) : (
                            <span>Connected via the broader Kue graph.</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 text-right">
                        <Badge variant="secondary">On Kue</Badge>
                        <Button size="sm" onClick={() => handleInviteExisting(person.name)}>
                          Invite to workspace
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div className="md:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invite more friends</CardTitle>
              <CardDescription>
                Bring more of your close collaborators into Kue so you can map warm paths together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleInviteNew}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="friend-email">
                    Work email
                  </label>
                  <Input
                    id="friend-email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="off"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="friend-note">
                    Optional note
                  </label>
                  <Textarea
                    id="friend-note"
                    name="note"
                    placeholder="Share why you think Kue would be helpful for them."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send invite
                </Button>

                <p className="text-xs text-muted-foreground">
                  This is a prototype. Invites won&apos;t actually be sent yet, but this shows the intended flow.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

export default Friends;

