import type { Chain } from "../src/types";
export default {
  "chain": "unreal",
  "chainId": 18233,
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
  "name": "unreal",
  "nativeCurrency": {
    "name": "unreal Ether",
    "symbol": "reETH",
    "decimals": 18
  },
  "networkId": 18233,
  "parent": {
    "type": "L2",
    "chain": "eip155-17000",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/unreal"
      }
    ]
  },
  "rpc": [
    "https://18233.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.unreal-orbit.gelato.digital",
    "wss://ws.unreal-orbit.gelato.digital"
  ],
  "shortName": "unreal",
  "slip44": 60,
  "slug": "unreal",
  "testnet": true,
  "title": "unreal testnet for re.al"
} as const satisfies Chain;