import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import type { BatchSubmission, BatchResponse } from "@/lib/types";

export function useSubmitBatch() {
  return useMutation<BatchResponse, Error, BatchSubmission>({
    mutationFn: (payload) =>
      apiFetch<BatchResponse, BatchSubmission>("/api/manufacturers/batches", {
        method: "POST",
        body: payload,
      }),
  });
}
