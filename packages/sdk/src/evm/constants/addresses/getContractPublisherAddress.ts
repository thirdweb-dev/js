import { getProcessEnv } from "../../../core/utils/process";

const ContractPublisher_address = "0x664244560eBa21Bf82d7150C791bE1AbcD5B4cd7"; // Polygon only

/**
 * @internal
 */
export function getContractPublisherAddress() {
  if (getProcessEnv("contractPublisherAddress")) {
    return getProcessEnv("contractPublisherAddress");
  } else {
    return ContractPublisher_address;
  }
}
