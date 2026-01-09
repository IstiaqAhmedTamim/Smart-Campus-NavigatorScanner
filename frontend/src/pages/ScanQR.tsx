import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { useScanQR } from "@/hooks/use-scans";
import { useLocations } from "@/hooks/use-locations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scan, LogIn, LogOut, Camera, Loader2, XCircle } from "lucide-react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useToast } from "@/hooks/use-toast";

export default function ScanQR() {
  const scanMutation = useScanQR();
  const { data: locations } = useLocations();
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [mode, setMode] = useState<"entry" | "exit">("entry");
  const [isScanning, setIsScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (showCamera) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Find location by QR code
          const location = locations?.find(l => l.qrCode === decodedText);
          if (location) {
            scanMutation.mutate({
              qrCode: decodedText,
              type: mode
            });
            stopScanning();
          } else {
            toast({
              title: "Invalid QR Code",
              description: "This code does not match any campus location.",
              variant: "destructive"
            });
          }
        },
        (error) => {
          // Ignore errors
        }
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [showCamera, mode, locations]);

  const stopScanning = () => {
    setShowCamera(false);
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
  };

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

              <div className="space-y-6">
                {showCamera ? (
                  <div className="space-y-4">
                    <div id="qr-reader" className="overflow-hidden rounded-xl border-2 border-primary/20 bg-slate-100 min-h-[300px]" />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={stopScanning}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel Camera Scan
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full h-16 text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl"
                    onClick={() => setShowCamera(true)}
                  >
                    <Camera className="w-6 h-6 mr-3" />
                    Open Device Camera
                  </Button>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or simulate scan</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6 border border-dashed border-slate-300 text-center">
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
                      disabled={!selectedLocation || isScanning || scanMutation.isPending || showCamera}
                    >
                      {isScanning || scanMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Scan className="w-5 h-5 mr-2" />
                          Simulate {mode === 'entry' ? 'Entry' : 'Exit'}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
