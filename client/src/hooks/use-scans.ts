import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type ScanRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useScanQR() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScanRequest) => {
      const res = await fetch(api.scans.create.path, {
        method: api.scans.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Scan failed");
      }
      return api.scans.create.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      // Invalidate locations to update counts immediately
      queryClient.invalidateQueries({ queryKey: [api.locations.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.locations.recommend.path] });
      
      toast({
        title: "Scan Successful",
        description: `${data.message} - ${data.location.name}`,
        variant: "default",
        className: "bg-primary text-primary-foreground border-none",
      });
    },
    onError: (error) => {
      toast({
        title: "Scan Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
