import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, Code, BookOpen, Video, Trophy, Users, Briefcase, Music } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  Wrench: <Wrench className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Video: <Video className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
  Users: <Users className="w-6 h-6" />,
  Briefcase: <Briefcase className="w-6 h-6" />,
  Music: <Music className="w-6 h-6" />,
};

const categories = [
  { name: "Workshops", slug: "workshops", icon: "Wrench", color: "bg-blue-500/10 text-blue-600" },
  { name: "Hackathons", slug: "hackathons", icon: "Code", color: "bg-emerald-500/10 text-emerald-600" },
  { name: "Seminars", slug: "seminars", icon: "BookOpen", color: "bg-amber-500/10 text-amber-600" },
  { name: "Webinars", slug: "webinars", icon: "Video", color: "bg-purple-500/10 text-purple-600" },
  { name: "Competitions", slug: "competitions", icon: "Trophy", color: "bg-red-500/10 text-red-600" },
  { name: "Networking", slug: "networking", icon: "Users", color: "bg-cyan-500/10 text-cyan-600" },
  { name: "Career Fairs", slug: "career-fairs", icon: "Briefcase", color: "bg-indigo-500/10 text-indigo-600" },
  { name: "Cultural", slug: "cultural", icon: "Music", color: "bg-pink-500/10 text-pink-600" },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Browse by Category</h2>
          <p className="text-muted-foreground text-lg">Find events that match your interests</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/events?category=${cat.slug}`)}
              className="flex flex-col items-center gap-3 p-5 rounded-xl bg-card border border-border hover:shadow-[var(--shadow-card-hover)] hover:border-primary/30 transition-all group"
            >
              <div className={`p-3 rounded-lg ${cat.color} group-hover:scale-110 transition-transform`}>
                {iconMap[cat.icon]}
              </div>
              <span className="text-sm font-medium text-foreground">{cat.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
