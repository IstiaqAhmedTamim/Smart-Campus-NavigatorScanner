import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useScanQR } from "@/hooks/use-scans";
import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scan, LogIn, LogOut, Camera, Loader2 } from "lucide-react";

export default function ScanQR() {
  const scanMutation = useScanQR();
  const { data: locations } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [mode, setMode] = useState<"entry" | "exit">("entry");
  const [isScanning, setIsScanning] = useState(false);

  // Simulate scanning process
  const handleSimulateScan = () => {
    if (!selectedLocation) return;
    
    setIsScanning(true);
    
    // Artificial delay to simulate camera processing
    setTimeout(() => {
      const location = locations?.find(l => l.id.toString() === selectedLocation);
      if (location) {
        scanMutation.mutate({
          qrCode: location.qrCode,
          type: mode
        });
      }
      setIsScanning(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold text-slate-900">QR Scanner</h1>
          <p className="text-slate-500 mt-1">Scan to update crowd density</p>
        </div>

        <Card className="border-border shadow-lg overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-border pb-6">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 border border-slate-100">
              <Camera className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center">Scan Location Code</CardTitle>
            <CardDescription className="text-center">
              Point your camera at the location QR code
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <Tabs defaultValue="entry" onValueChange={(v) => setMode(v as "entry" | "exit")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="entry" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                  <LogIn className="w-4 h-4 mr-2" />
                  Entry
                </TabsTrigger>
                <TabsTrigger value="exit" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
                  <LogOut className="w-4 h-4 mr-2" />
                  Exit
                </TabsTrigger>
              </TabsList>

              <div className="bg-slate-50 rounded-xl p-6 border border-dashed border-slate-300 text-center mb-6">
                <p className="text-sm text-slate-500 mb-4 font-medium uppercase tracking-wide">
                  Development Mode: Simulate Scan
                </p>
                
                <div className="space-y-4">
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select location to simulate" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations?.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id.toString()}>
                          {loc.name} ({loc.qrCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    className={`w-full h-12 text-lg font-bold shadow-lg transition-all ${
                      mode === 'entry' 
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
                        : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'
                    }`}
                    onClick={handleSimulateScan}
                    disabled={!selectedLocation || isScanning || scanMutation.isPending}
                  >
                    {isScanning || scanMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Scan className="w-5 h-5 mr-2" />
                        Confirm {mode === 'entry' ? 'Entry' : 'Exit'} Scan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
