import { useLocations } from "@/hooks/use-locations";
import { Layout } from "@/components/Layout";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Stats() {
  const { data: locations, isLoading } = useLocations();

  const data = locations?.map(loc => ({
    name: loc.name,
    count: loc.currentCount,
    capacity: loc.capacity,
    percentage: loc.percentage,
    color: loc.status === 'low' ? '#10b981' : loc.status === 'medium' ? '#f59e0b' : '#f43f5e'
  })) || [];

  const totalCapacity = locations?.reduce((acc, curr) => acc + curr.capacity, 0) || 0;
  const totalOccupancy = locations?.reduce((acc, curr) => acc + curr.currentCount, 0) || 0;
  const averageOccupancy = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900">Campus Analytics</h1>
          <p className="text-slate-500 mt-1">Crowd distribution and trends</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-primary to-cyan-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-cyan-100">Total People on Campus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalOccupancy}</div>
              <p className="text-cyan-100 text-sm mt-1">Active users detected</p>
            </CardContent>
          </Card>
          
          <Card className="border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Average Occupancy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-800">{averageOccupancy}%</div>
              <p className="text-slate-400 text-sm mt-1">Across all locations</p>
            </CardContent>
          </Card>

          <Card className="border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Active Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-slate-800">{locations?.length || 0}</div>
              <p className="text-slate-400 text-sm mt-1">Monitored zones</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-md border-border">
            <CardHeader>
              <CardTitle>Current Crowd Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="percentage" name="Occupancy %" radius={[4, 4, 0, 0]}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md border-border">
            <CardHeader>
              <CardTitle>Occupancy Share</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
