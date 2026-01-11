import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useLocations() {
  return useQuery({
    queryKey: [api.locations.list.path],
    queryFn: async () => {
      const res = await fetch(api.locations.list.path, { credentials: 'include' });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Please log in to view locations");
        throw new Error("Failed to fetch locations");
      }
      return api.locations.list.responses[200].parse(await res.json());
    },
    refetchInterval: 2000, // Poll every 2 seconds for live crowd data
  });
}

export function useLocation(id: number) {
  return useQuery({
    queryKey: [api.locations.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.locations.get.path, { id });
      const res = await fetch(url, { credentials: 'include' });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch location");
      return api.locations.get.responses[200].parse(await res.json());
    },
    refetchInterval: 2000,
  });
}

export function useRecommendation() {
  return useQuery({
    queryKey: [api.locations.recommend.path],
    queryFn: async () => {
      const res = await fetch(api.locations.recommend.path, { credentials: 'include' });
      if (!res.ok) throw new Error("Failed to fetch recommendation");
      return api.locations.recommend.responses[200].parse(await res.json());
    },
    refetchInterval: 5000,
  });
}
