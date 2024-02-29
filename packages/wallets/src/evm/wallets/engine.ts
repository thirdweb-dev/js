import { Signer } from "ethers";
import {
  EngineSigner,
  EngineSignerConfiguration,
} from "../connectors/engine/signer";
import { AbstractWallet } from "./abstract";

/**
 * @wallet
 */
export class EngineWallet extends AbstractWallet {
  private _signer: EngineSigner;

  constructor(config: EngineSignerConfiguration) {
    super();
    this._signer = new EngineSigner(config);
  }

  async getSigner(): Promise<Signer> {
    return this._signer;
  }
}
