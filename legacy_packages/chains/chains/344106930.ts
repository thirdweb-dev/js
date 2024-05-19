import type { Chain } from "../src/types";
export default {
  "chain": "staging-utter-unripe-menkar",
  "chainId": 344106930,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "infoURL": "https://calypsohub.network/",
  "name": "Deprecated SKALE Calypso Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 344106930,
  "rpc": [
    "https://344106930.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
  ],
  "shortName": "deprected-calypso-testnet",
  "slip44": 1,
  "slug": "deprecated-skale-calypso-hub-testnet",
  "status": "deprecated",
  "testnet": true,
  "title": "Deprecated Calypso NFT Hub Testnet"
} as const satisfies Chain;