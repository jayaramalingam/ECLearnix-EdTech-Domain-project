import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CalendarDays, MapPin, Users, Share2, Bookmark, BookmarkCheck, Loader2, Globe, Clock } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [organizer, setOrganizer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  useEffect(() => {
    if (user && id) checkUserStatus();
  }, [user, id]);

  const fetchEvent = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("events")
      .select("*, categories(name, slug)")
      .eq("id", id)
      .single();
    if (data) {
      setEvent(data);
      // Fetch organizer profile
      const { data: org } = await supabase.from("profiles").select("*").eq("user_id", data.organizer_id).single();
      if (org) setOrganizer(org);
    }
    setLoading(false);
  };

  const checkUserStatus = async () => {
    const [regRes, bookRes] = await Promise.all([
      supabase.from("registrations").select("id").eq("user_id", user.id).eq("event_id", id!).maybeSingle(),
      supabase.from("bookmarks").select("id").eq("user_id", user.id).eq("event_id", id!).maybeSingle(),
    ]);
    setIsRegistered(!!regRes.data);
    setIsBookmarked(!!bookRes.data);
  };

  const handleRegister = async () => {
    if (!user) { navigate("/auth"); return; }
    setActionLoading(true);
    if (isRegistered) {
      await supabase.from("registrations").delete().eq("user_id", user.id).eq("event_id", id!);
      setIsRegistered(false);
      toast({ title: "Registration cancelled" });
    } else {
      await supabase.from("registrations").insert({ user_id: user.id, event_id: id });
      setIsRegistered(true);
      toast({ title: "Registered successfully! 🎉" });
    }
    fetchEvent();
    setActionLoading(false);
  };

  const handleBookmark = async () => {
    if (!user) { navigate("/auth"); return; }
    if (isBookmarked) {
      await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("event_id", id!);
      setIsBookmarked(false);
    } else {
      await supabase.from("bookmarks").insert({ user_id: user.id, event_id: id });
      setIsBookmarked(true);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied to clipboard!" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center pt-32"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="text-center pt-32">
          <p className="text-muted-foreground text-lg">Event not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/events")}>Browse Events</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero banner */}
          <div className="h-48 md:h-64 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-8">
            <CalendarDays className="w-16 h-16 text-primary/30" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {event.categories && <Badge variant="secondary">{event.categories.name}</Badge>}
                  {event.is_free && <Badge className="bg-emerald-500/10 text-emerald-600 border-0">Free</Badge>}
                  <Badge variant="outline" className="capitalize">{event.status}</Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{event.title}</h1>
                {event.short_description && <p className="text-lg text-muted-foreground mb-4">{event.short_description}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{format(new Date(event.start_date), "EEEE, MMMM d, yyyy")}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(event.start_date), "h:mm a")}{event.end_date && ` — ${format(new Date(event.end_date), "h:mm a")}`}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border">
                  {event.is_online ? <Globe className="w-5 h-5 text-primary" /> : <MapPin className="w-5 h-5 text-primary" />}
                  <div>
                    <div className="text-sm font-medium text-foreground">{event.is_online ? "Online Event" : event.location || "TBA"}</div>
                    {event.is_online && event.meeting_link && <div className="text-xs text-muted-foreground">Link available after registration</div>}
                  </div>
                </div>
              </div>

              {event.description && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">About This Event</h2>
                  <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">{event.description}</div>
                </div>
              )}

              {event.eligibility && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">Eligibility</h2>
                  <p className="text-muted-foreground">{event.eligibility}</p>
                </div>
              )}

              {event.prizes && (
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-3">Prizes</h2>
                  <p className="text-muted-foreground">{event.prizes}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">{event.registration_count} registered</span>
                    {event.max_attendees && <span className="text-xs">/ {event.max_attendees} spots</span>}
                  </div>

                  <Button
                    className="w-full"
                    variant={isRegistered ? "outline" : "default"}
                    onClick={handleRegister}
                    disabled={actionLoading}
                  >
                    {actionLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                    {isRegistered ? "Cancel Registration" : "Register Now"}
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleBookmark}>
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 mr-1 text-primary" /> : <Bookmark className="w-4 h-4 mr-1" />}
                      {isBookmarked ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-1" /> Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Organizer card */}
              {organizer && (
                <Card>
                  <CardContent className="p-5">
                    <div className="text-xs text-muted-foreground mb-3">ORGANIZED BY</div>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {organizer.full_name?.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{organizer.full_name}</div>
                        {organizer.college && <div className="text-xs text-muted-foreground">{organizer.college}</div>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventDetails;
