import type { Chain } from "../src/types";
export default {
  "chain": "EVMCC",
  "chainId": 776877,
  "explorers": [
    {
      "name": "Tanssi Explorer",
      "url": "https://tanssi-evmexplorer.netlify.app/?rpcUrl=https://fraa-dancebox-3035-rpc.a.dancebox.tanssi.network",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.rmrk.app/",
  "name": "Modularium",
  "nativeCurrency": {
    "name": "Modularium",
    "symbol": "MDM",
    "decimals": 18
  },
  "networkId": 776877,
  "rpc": [
    "https://modularium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://776877.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-dancebox-3035-rpc.a.dancebox.tanssi.network"
  ],
  "shortName": "mdlrm",
  "slug": "modularium",
  "testnet": false
} as const satisfies Chain;