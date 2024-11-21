import { createStore } from "@/lib/reactive";
import type { TruncatedSessionInfo } from "./api/types";

export const newChatPageUrlStore = createStore<string | undefined>(undefined);

export const newSessionsStore = createStore<TruncatedSessionInfo[]>([]);

export const deletedSessionsStore = createStore<
  string[] // array of session ids
>([]);
