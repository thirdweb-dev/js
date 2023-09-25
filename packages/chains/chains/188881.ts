import type { Chain } from "../src/types";
export default {
  "chainId": 188881,
  "chain": "CONDOR",
  "name": "Condor Test Network",
  "rpc": [
    "https://condor-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.condor.systems/rpc"
  ],
  "slug": "condor-test-network",
  "icon": {
    "url": "ipfs://QmPRDuEJSTqp2cDUvWCp71Wns6XV8nvdeAVKWH6srpk4xM",
    "width": 752,
    "height": 752,
    "format": "png"
  },
  "faucets": [
    "https://faucet.condor.systems"
  ],
  "nativeCurrency": {
    "name": "Condor Native Token",
    "symbol": "CONDOR",
    "decimals": 18
  },
  "infoURL": "https://condor.systems",
  "shortName": "condor",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "CondorScan",
      "url": "https://explorer.condor.systems",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;