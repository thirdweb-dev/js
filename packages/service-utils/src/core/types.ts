export type CoreAuthInput = {
  // for passing it from the subdomain or path or other service specific things
  clientId?: string;
  // for passing in the address target in RPC or bundler services
  targetAddress?: string | string[];
};
