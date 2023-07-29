import type { Chain } from "../src/types";
export default {
  "name": "PulseChain",
  "shortName": "pls",
  "chain": "PLS",
  "chainId": 369,
  "networkId": 369,
  "infoURL": "https://pulsechain.com/",
  "rpc": [
    "https://pulsechain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.pulsechain.com/",
    "wss://rpc.pulsechain.com/"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "faucets": [],
  "ens": {
    "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
  },
  "status": "incubating",
  "nativeCurrency": {
    "name": "Pulse",
    "symbol": "PLS",
    "decimals": 18
  },
  "testnet": false,
  "slug": "pulsechain"
} as const satisfies Chain;