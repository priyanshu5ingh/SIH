import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { TraceResult } from "@/lib/types";

export function useTrace(productId?: string) {
  return useQuery<TraceResult, Error>({
    queryKey: ["trace", productId],
    queryFn: () => apiFetch<TraceResult>(`/api/trace?productId=${encodeURIComponent(productId || "")}`),
    enabled: !!productId,
  });
}
