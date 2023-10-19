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
  "features": [],
  "infoURL": "https://calypsohub.network/",
  "name": "Calypso NFT Hub (SKALE Testnet)",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://calypso-nft-hub-skale-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
  ],
  "shortName": "calypso-testnet",
  "slug": "calypso-nft-hub-skale-testnet",
  "testnet": true
} as const satisfies Chain;