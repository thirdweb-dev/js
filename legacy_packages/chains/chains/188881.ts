import type { Chain } from "../src/types";
export default {
  "chain": "CONDOR",
  "chainId": 188881,
  "explorers": [
    {
      "name": "CondorScan",
      "url": "https://explorer.condor.systems",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://faucet.condor.systems"
  ],
  "infoURL": "https://condor.systems",
  "name": "Condor Test Network",
  "nativeCurrency": {
    "name": "Condor Native Token",
    "symbol": "CONDOR",
    "decimals": 18
  },
  "networkId": 188881,
  "rpc": [
    "https://188881.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.condor.systems/rpc"
  ],
  "shortName": "condor",
  "slip44": 1,
  "slug": "condor-test-network",
  "testnet": true
} as const satisfies Chain;