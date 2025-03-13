export type CoreAuthInput = {
  // for passing it from the subdomain or path or other service specific things
  clientId?: string;
  // For providing a specific team the user is trying to authenticate for. Used only for dashboard auth.
  teamId?: string;
  // for passing in the address target in RPC or bundler services
  targetAddress?: string | string[];
};
