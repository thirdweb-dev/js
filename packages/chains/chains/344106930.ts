import type { Chain } from "../src/types";
export default {
  "chainId": 344106930,
  "chain": "staging-utter-unripe-menkar",
  "name": "Calypso NFT Hub (SKALE Testnet)",
  "rpc": [
    "https://calypso-nft-hub-skale-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar"
  ],
  "slug": "calypso-nft-hub-skale-testnet",
  "faucets": [
    "https://sfuel.dirtroad.dev/staging"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://calypsohub.network/",
  "shortName": "calypso-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;