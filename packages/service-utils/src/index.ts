import { SERVICES } from "./types";

export function getServiceByName(name: string) {
  return SERVICES.find((srv) => srv.name === name);
}

export * from "./types";
export * from "./auth";
