import type { Chain } from "../src/types";
export default {
  "chain": "giant-half-dual-testnet",
  "chainId": 974399131,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://giant-half-dual-testnet.explorer.testnet.skalenodes.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.sfuelstation.com/"
  ],
  "infoURL": "https://calypsohub.network/",
  "name": "SKALE Calypso Hub Testnet",
  "nativeCurrency": {
    "name": "sFUEL",
    "symbol": "sFUEL",
    "decimals": 18
  },
  "networkId": 974399131,
  "rpc": [
    "https://974399131.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.skalenodes.com/v1/giant-half-dual-testnet"
  ],
  "shortName": "calypso-testnet",
  "slip44": 1,
  "slug": "skale-calypso-hub-testnet",
  "testnet": true,
  "title": "SKALE Calypso Hub Testnet"
} as const satisfies Chain;