import { useStore } from "@/lib/reactive";
import type { TruncatedSessionInfo } from "../api/types";
import { deletedSessionsStore, newSessionsStore } from "../stores";

export function useSessionsWithLocalOverrides(
  _sessions: TruncatedSessionInfo[],
) {
  const newAddedSessions = useStore(newSessionsStore);
  const deletedSessions = useStore(deletedSessionsStore);
  return [...newAddedSessions, ..._sessions].filter((s) => {
    return !deletedSessions.some((d) => d === s.id);
  });
}
