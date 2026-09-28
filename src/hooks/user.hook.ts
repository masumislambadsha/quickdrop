import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type UpdateMePayload, updateMe } from "@/api";

export function useUpdateMe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateMePayload) => updateMe(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
}
