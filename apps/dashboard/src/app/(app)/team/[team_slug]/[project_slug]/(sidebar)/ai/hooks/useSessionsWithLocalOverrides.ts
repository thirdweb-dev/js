import { useStore } from "@/lib/reactive";
import type { TruncatedSessionInfo } from "../api/types";
import { deletedSessionsStore, newSessionsStore } from "../stores";

export function useSessionsWithLocalOverrides(
  _sessions: TruncatedSessionInfo[],
) {
  const newAddedSessions = useStore(newSessionsStore);
  const deletedSessions = useStore(deletedSessionsStore);
  const mergedSessions = [..._sessions];

  for (const session of newAddedSessions) {
    // if adding a new session that has same id as existing session, update the existing session
    const index = mergedSessions.findIndex((s) => s.id === session.id);
    if (index !== -1) {
      mergedSessions[index] = session;
    } else {
      mergedSessions.unshift(session);
    }
  }

  return mergedSessions.filter((s) => {
    return !deletedSessions.some((d) => d === s.id);
  });
}
