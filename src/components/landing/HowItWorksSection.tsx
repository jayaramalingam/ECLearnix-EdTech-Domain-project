import { motion } from "framer-motion";
import { UserPlus, Search, CalendarCheck, Star } from "lucide-react";

const steps = [
  { icon: <UserPlus className="w-7 h-7" />, title: "Sign Up", description: "Create your free account and select your role" },
  { icon: <Search className="w-7 h-7" />, title: "Discover", description: "Browse events by category, date, or college" },
  { icon: <CalendarCheck className="w-7 h-7" />, title: "Register", description: "One-click registration with instant confirmation" },
  { icon: <Star className="w-7 h-7" />, title: "Participate", description: "Attend, network, and grow your skills" },
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">How It Works</h2>
          <p className="text-muted-foreground text-lg">Get started in 4 simple steps</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative text-center"
            >
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground mb-4 shadow-lg shadow-primary/20">
                {step.icon}
              </div>
              <div className="text-xs font-bold text-primary mb-1">STEP {i + 1}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
