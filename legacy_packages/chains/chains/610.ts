import type { Chain } from "../src/types";
export default {
  "chain": "Darwin",
  "chainId": 610,
  "explorers": [
    {
      "name": "Darwin Explorer",
      "url": "https://explorer.darwinchain.ai",
      "standard": "none",
      "icon": {
        "url": "ipfs://bafybeid4rtdlpd2woogag6vv5yvvwapfa77th3t7a76dneogkcgp757t7e",
        "width": 2000,
        "height": 2000,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://devnet.darwinchain.ai/faucet"
  ],
  "icon": {
    "url": "ipfs://bafybeid4rtdlpd2woogag6vv5yvvwapfa77th3t7a76dneogkcgp757t7e",
    "width": 2000,
    "height": 2000,
    "format": "png"
  },
  "infoURL": "https://darwinchain.ai",
  "name": "Darwin Devnet",
  "nativeCurrency": {
    "name": "Darwin Devnet token",
    "symbol": "DNA",
    "decimals": 18
  },
  "networkId": 610,
  "rpc": [
    "https://610.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://devnet.darwinchain.ai"
  ],
  "shortName": "darwin-devnet",
  "slug": "darwin-devnet",
  "testnet": false
} as const satisfies Chain;