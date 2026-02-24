import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "B.Tech Student, IIT Delhi",
    text: "Found an amazing hackathon through AllCollegeEvent that helped me land my first internship. The platform is super easy to use!",
    initials: "PS",
  },
  {
    name: "Rahul Verma",
    role: "Faculty, BITS Pilani",
    text: "As an organizer, managing registrations and communicating with attendees has never been easier. Highly recommended for college events.",
    initials: "RV",
  },
  {
    name: "Ananya Gupta",
    role: "Entrepreneur, Mumbai",
    text: "I use AllCollegeEvent to discover talent through hackathons and competitions. It's the best platform to connect with the next generation.",
    initials: "AG",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 md:py-20 bg-primary/[0.03]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">What Our Users Say</h2>
          <p className="text-muted-foreground text-lg">Trusted by thousands of students and organizers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full shadow-[var(--shadow-card)] border-border">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 bg-primary/10">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{t.initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
