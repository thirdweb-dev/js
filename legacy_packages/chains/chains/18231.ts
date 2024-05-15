import type { Chain } from "../src/types";
export default {
  "chain": "unreal",
  "chainId": 18231,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://unreal.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmZbtoK9Q1DHTHjsgPUfHkzb9xdWzrSfPwPQ8M8FPu84mA",
        "width": 300,
        "height": 301,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZbtoK9Q1DHTHjsgPUfHkzb9xdWzrSfPwPQ8M8FPu84mA",
    "width": 300,
    "height": 301,
    "format": "png"
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/unreal",
  "name": "unreal-old",
  "nativeCurrency": {
    "name": "unreal Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 18231,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": []
  },
  "rpc": [
    "https://18231.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.unreal.gelato.digital",
    "wss://ws.unreal.gelato.digital"
  ],
  "shortName": "unreal-old",
  "slip44": 60,
  "slug": "unreal-old",
  "status": "deprecated",
  "testnet": true,
  "title": "unreal testnet for re.al"
} as const satisfies Chain;