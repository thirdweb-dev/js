import { Signer } from "ethers";
import {
  EngineSigner,
  EngineSignerConfiguration,
} from "../connectors/engine/signer";
import { AbstractWallet } from "./abstract";

export class EngineWallet extends AbstractWallet {
  #signer: EngineSigner;

  constructor(config: EngineSignerConfiguration) {
    super();
    this.#signer = new EngineSigner(config);
  }

  async getSigner(): Promise<Signer> {
    return this.#signer;
  }
}
