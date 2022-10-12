import { useSingleQueryParam } from "hooks/useQueryParam";
import {
  SupportedNetwork,
  getChainIdFromNetworkPath,
  getSolNetworkFromNetworkPath,
} from "utils/network";

export function useDashboardEVMChainId() {
  const dashboardNetwork = useDashboardNetwork();
  return getChainIdFromNetworkPath(dashboardNetwork);
}

export function useDashboardSOLNetworkId() {
  const dashboardNetwork = useDashboardNetwork();
  return getSolNetworkFromNetworkPath(dashboardNetwork);
}

export function useDashboardNetwork(): SupportedNetwork | undefined {
  return useSingleQueryParam<SupportedNetwork>("networkOrAddress");
}
