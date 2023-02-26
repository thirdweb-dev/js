import { walletsMetadata } from "../constants/walletsMetadata";
import { Wallet } from "../types/wallet";

export function getWallets(): Wallet[] {
    return [walletsMetadata['metamask']];
}