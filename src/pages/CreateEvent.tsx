import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState("");
  const [maxAttendees, setMaxAttendees] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [prizes, setPrizes] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { navigate("/auth"); return; }
      setUser(session.user);
    });
    fetchCategories();
  }, [navigate]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!title || !startDate || !categoryId) {
      toast({ title: "Please fill in required fields", description: "Title, category, and start date are required.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("events").insert({
      title,
      short_description: shortDescription || null,
      description: description || null,
      category_id: categoryId,
      organizer_id: user.id,
      start_date: new Date(startDate).toISOString(),
      end_date: endDate ? new Date(endDate).toISOString() : null,
      is_online: isOnline,
      location: isOnline ? null : location || null,
      meeting_link: isOnline ? meetingLink || null : null,
      is_free: isFree,
      price: isFree ? 0 : parseFloat(price) || 0,
      max_attendees: maxAttendees ? parseInt(maxAttendees) : null,
      eligibility: eligibility || null,
      prizes: prizes || null,
      status,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error creating event", description: error.message, variant: "destructive" });
    } else {
      toast({ title: status === "published" ? "Event published! 🎉" : "Draft saved" });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Create New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Event Title *</Label>
                  <Input placeholder="e.g. National Hackathon 2026" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input placeholder="A brief one-liner" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea rows={5} placeholder="Detailed event description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
              </div>

              {/* Date & time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date & Time *</Label>
                  <Input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>End Date & Time</Label>
                  <Input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch checked={isOnline} onCheckedChange={setIsOnline} />
                  <Label>This is an online event</Label>
                </div>
                {isOnline ? (
                  <div className="space-y-2">
                    <Label>Meeting Link</Label>
                    <Input placeholder="https://meet.google.com/..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Venue / Location</Label>
                    <Input placeholder="e.g. IIT Delhi, Main Auditorium" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Switch checked={isFree} onCheckedChange={setIsFree} />
                  <Label>Free Event</Label>
                </div>
                {!isFree && (
                  <div className="space-y-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" placeholder="499" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                )}
              </div>

              {/* Additional */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Max Attendees</Label>
                  <Input type="number" placeholder="Leave blank for unlimited" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Eligibility</Label>
                  <Input placeholder="e.g. Open to all B.Tech students" value={eligibility} onChange={(e) => setEligibility(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Prizes</Label>
                  <Textarea rows={2} placeholder="e.g. 1st: ₹50,000, 2nd: ₹25,000" value={prizes} onChange={(e) => setPrizes(e.target.value)} />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => handleSubmit("draft")} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Save as Draft
                </Button>
                <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => handleSubmit("published")} disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Publish Event
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateEvent;
