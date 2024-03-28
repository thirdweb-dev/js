import { getProcessEnv } from "../../../core/utils/process";

const ContractPublisher_address = "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808"; // Polygon only

/**
 * @internal
 */
export function getContractPublisherAddress() {
  return getProcessEnv("contractPublisherAddress", ContractPublisher_address);
}
