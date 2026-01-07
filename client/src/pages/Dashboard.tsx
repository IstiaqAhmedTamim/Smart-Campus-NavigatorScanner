import { useLocations, useRecommendation } from "@/hooks/use-locations";
import { Layout } from "@/components/Layout";
import { CrowdCard } from "@/components/CrowdCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapPin, Info, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: locations, isLoading: isLoadingLocations } = useLocations();
  const { data: recommendation, isLoading: isLoadingRec } = useRecommendation();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-slate-900">Live Campus Pulse</h1>
            <p className="text-slate-500 mt-1">Real-time crowd monitoring and safe navigation</p>
          </div>
          <div className="flex items-center gap-2">
             <Link href="/scan">
               <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20">
                 Scan Entry/Exit
                 <ArrowRight className="ml-2 w-4 h-4" />
               </Button>
             </Link>
          </div>
        </div>

        {/* Recommendation Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Smart Recommendation</h2>
          </div>

          {isLoadingRec ? (
            <Skeleton className="w-full h-48 rounded-2xl" />
          ) : recommendation ? (
            <CrowdCard location={recommendation} recommended />
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
              Not enough data for recommendations yet.
            </div>
          )}
        </section>

        {/* All Locations Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Current Status</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingLocations ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))
            ) : locations?.length ? (
              locations.map((loc) => (
                <CrowdCard key={loc.id} location={loc} />
              ))
            ) : (
              <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-2xl border">
                No locations configured.
              </div>
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
}
