import { createStore } from "@/lib/reactive";
import type { TruncatedSessionInfo } from "./api/types";

export const newSessionsStore = createStore<TruncatedSessionInfo[]>([]);

// array of deleted session ids
export const deletedSessionsStore = createStore<string[]>([]);
