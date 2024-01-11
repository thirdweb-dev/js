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
  "icon": {
    "url": "ipfs://QmPRDuEJSTqp2cDUvWCp71Wns6XV8nvdeAVKWH6srpk4xM",
    "width": 752,
    "height": 752,
    "format": "png"
  },
  "infoURL": "https://condor.systems",
  "name": "Condor Test Network",
  "nativeCurrency": {
    "name": "Condor Native Token",
    "symbol": "CONDOR",
    "decimals": 18
  },
  "networkId": 188881,
  "rpc": [
    "https://condor-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://188881.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.condor.systems/rpc"
  ],
  "shortName": "condor",
  "slip44": 1,
  "slug": "condor-test-network",
  "testnet": true
} as const satisfies Chain;