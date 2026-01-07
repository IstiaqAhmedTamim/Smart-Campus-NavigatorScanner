import { type LocationStats, CROWD_LEVELS } from "@shared/schema";
import { Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CrowdCardProps {
  location: LocationStats;
  recommended?: boolean;
}

export function CrowdCard({ location, recommended }: CrowdCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "low": return "bg-emerald-500 shadow-emerald-500/50";
      case "medium": return "bg-amber-500 shadow-amber-500/50";
      case "high": return "bg-rose-500 shadow-rose-500/50";
      default: return "bg-slate-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "low": return "text-emerald-600";
      case "medium": return "text-amber-600";
      case "high": return "text-rose-600";
      default: return "text-slate-600";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden bg-white rounded-2xl border transition-all duration-300 group hover:-translate-y-1",
        recommended 
          ? "border-primary/30 shadow-xl shadow-primary/10 ring-2 ring-primary/20" 
          : "border-border shadow-sm hover:shadow-lg hover:border-border/80"
      )}
    >
      {recommended && (
        <div className="absolute top-0 right-0 px-4 py-1 bg-gradient-to-r from-primary to-cyan-500 text-white text-xs font-bold rounded-bl-xl z-10 shadow-lg">
          Best Choice
        </div>
      )}

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-display font-bold text-slate-800 group-hover:text-primary transition-colors">
              {location.name}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{location.description}</p>
          </div>
          <div className="relative flex items-center justify-center w-12 h-12">
            {/* Pulse effect for high crowd */}
            {location.status === 'high' && (
              <div className="absolute inset-0 rounded-full bg-rose-500/30 animate-pulse-ring" />
            )}
            <div className={cn(
              "w-3 h-3 rounded-full shadow-lg",
              getStatusColor(location.status)
            )} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Occupancy
            </span>
            <span className={cn("font-bold font-mono", getStatusText(location.status))}>
              {location.percentage}%
            </span>
          </div>

          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${location.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full transition-colors duration-500",
                location.status === "low" && "bg-emerald-500",
                location.status === "medium" && "bg-amber-500",
                location.status === "high" && "bg-rose-500"
              )}
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 rounded-lg p-2">
            {location.status === 'low' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            {location.status === 'high' && <AlertCircle className="w-4 h-4 text-rose-500" />}
            
            <span>
              {location.currentCount} / {location.capacity} people
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
