import { useLocations } from "@/hooks/use-locations";
import { Layout } from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Locations() {
  const { data: locations, isLoading } = useLocations();
  const [search, setSearch] = useState("");

  const filteredLocations = locations?.filter(loc => 
    loc.name.toLowerCase().includes(search.toLowerCase()) || 
    loc.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">All Locations</h1>
          <p className="text-slate-500 mt-1">Detailed capacity information</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            placeholder="Search locations..." 
            className="pl-10 h-12 rounded-xl border-slate-200 bg-white shadow-sm focus:border-primary focus:ring-primary/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-border">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Location Name</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Status</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Occupancy</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Capacity</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    </tr>
                  ))
                ) : filteredLocations?.length ? (
                  filteredLocations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{loc.name}</div>
                        <div className="text-xs text-slate-500">{loc.description}</div>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={`
                            ${loc.status === 'low' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100' : ''}
                            ${loc.status === 'medium' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                            ${loc.status === 'high' ? 'bg-rose-100 text-rose-700 hover:bg-rose-100' : ''}
                            border-none shadow-none uppercase text-[10px] tracking-wider
                          `}
                        >
                          {loc.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-mono text-slate-700 font-medium">
                        {loc.percentage}%
                      </td>
                      <td className="p-4 text-slate-500 text-sm">
                        {loc.currentCount} / {loc.capacity}
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        Just now
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      No locations found matching "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
