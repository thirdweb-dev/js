import { ContractEvents } from "./contract-events";
import { ContractWrapper } from "./contract-wrapper";
import type { TWFactory } from "@thirdweb-dev/contracts-js";
import { ProxyDeployedEvent } from "@thirdweb-dev/contracts-js/dist/declarations/src/TWFactory";

interface DeployEvent {
  transactionHash: string;
  contractAddress: string;
}

export class FactoryEvents extends ContractEvents<TWFactory> {
  constructor(contractWrapper: ContractWrapper<TWFactory>) {
    super(contractWrapper);
  }

  public addDeployListener(listener: (event: DeployEvent) => void) {
    this.addTransactionListener(async (event) => {
      if (!event.transactionHash) {
        return;
      }

      const receipt = await this.contractWrapper
        .getProvider()
        .getTransactionReceipt(event.transactionHash);

      if (receipt && receipt.logs) {
        const events = this.contractWrapper.parseLogs<ProxyDeployedEvent>(
          "ProxyDeployed",
          receipt.logs,
        );

        if (events.length > 0) {
          listener({
            ...event,
            contractAddress: events[0].args.proxy,
          });
        }
      } else {
        listener({
          ...event,
          transactionHash: event.transactionHash,
        });
      }
    });
  }

  public getContractWrapper(): ContractWrapper<TWFactory> {
    return this.contractWrapper;
  }
}
