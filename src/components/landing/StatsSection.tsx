import { motion } from "framer-motion";
import { CalendarDays, Users, GraduationCap, Globe } from "lucide-react";

const stats = [
  { icon: <CalendarDays className="w-6 h-6" />, value: "500+", label: "Events Hosted" },
  { icon: <Users className="w-6 h-6" />, value: "25,000+", label: "Registrations" },
  { icon: <GraduationCap className="w-6 h-6" />, value: "150+", label: "Colleges Connected" },
  { icon: <Globe className="w-6 h-6" />, value: "30+", label: "Cities Covered" },
];

const StatsSection = () => {
  return (
    <section className="py-16 bg-primary/[0.03]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
