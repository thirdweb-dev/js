export type ServiceName = "bundler" | "rpc" | "storage";

export interface ServiceAction {
  name: string;
  title: string;
  description?: string;
}

export interface Service {
  name: ServiceName;
  title: string;
  description?: string;
  actions: ServiceAction[];
}
