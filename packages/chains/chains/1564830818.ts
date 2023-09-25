import type { Chain } from "../src/types";
export default {
  "chainId": 1564830818,
  "chain": "honorable-steel-rasalhague",
  "name": "Calypso NFT Hub (SKALE)",
  "rpc": [
    "https://calypso-nft-hub-skale.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.skalenodes.com/v1/honorable-steel-rasalhague"
  ],
  "slug": "calypso-nft-hub-skale",
  "faucets": [
    "https://sfuel.dirtroad.dev"
  ],
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "infoURL": "https://calypsohub.network/",
  "shortName": "calypso-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;