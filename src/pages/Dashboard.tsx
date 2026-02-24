import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Plus, Bookmark, Users, Loader2 } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>("");
  const [myEvents, setMyEvents] = useState<any[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadData(session.user.id);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadData(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadData = async (userId: string) => {
    setLoading(true);
    const [profileRes, roleRes, myEventsRes, registrationsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).single(),
      supabase.from("user_roles").select("role").eq("user_id", userId).single(),
      supabase.from("events").select("*, categories(name)").eq("organizer_id", userId).order("created_at", { ascending: false }),
      supabase.from("registrations").select("*, events(*, categories(name))").eq("user_id", userId),
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (roleRes.data) setUserRole(roleRes.data.role);
    if (myEventsRes.data) setMyEvents(myEventsRes.data);
    if (registrationsRes.data) setRegisteredEvents(registrationsRes.data.map((r: any) => r.events).filter(Boolean));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome, {profile?.full_name || "there"}!
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                {userRole && <Badge variant="secondary" className="capitalize">{userRole}</Badge>}
                Your event dashboard
              </p>
            </div>
            <Button onClick={() => navigate("/events/create")} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-1" /> Create Event
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary"><CalendarDays className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{myEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Events Created</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600"><Users className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">{registeredEvents.length}</div>
                  <div className="text-sm text-muted-foreground">Events Registered</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600"><Bookmark className="w-5 h-5" /></div>
                <div>
                  <div className="text-2xl font-bold text-foreground">0</div>
                  <div className="text-sm text-muted-foreground">Bookmarked</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Events */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">My Created Events</CardTitle>
            </CardHeader>
            <CardContent>
              {myEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm py-4 text-center">You haven't created any events yet.</p>
              ) : (
                <div className="space-y-3">
                  {myEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                      <div>
                        <div className="font-medium text-foreground">{event.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <CalendarDays className="w-3 h-3" />
                          {format(new Date(event.start_date), "MMM d, yyyy")}
                          <Badge variant="outline" className="text-[10px] capitalize">{event.status}</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{event.registration_count} registered</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Registered Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registered Events</CardTitle>
            </CardHeader>
            <CardContent>
              {registeredEvents.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground text-sm mb-3">No registered events yet.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/events")}>Browse Events</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {registeredEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/events/${event.id}`)}>
                      <div>
                        <div className="font-medium text-foreground">{event.title}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          <CalendarDays className="w-3 h-3" />
                          {format(new Date(event.start_date), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
