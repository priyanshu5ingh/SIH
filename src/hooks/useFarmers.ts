import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { HarvestSubmission, HarvestResponse } from "@/lib/types";

export function useSubmitHarvest() {
  return useMutation<HarvestResponse, Error, HarvestSubmission>({
    mutationFn: (payload) => apiFetch<HarvestResponse, HarvestSubmission>("/api/farmers/harvest", {
      method: "POST",
      body: payload,
    }),
  });
}
