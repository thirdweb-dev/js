import type { Chain } from "../src/types";
export default {
  "chain": "NUM",
  "chainId": 10507,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://mainnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreie3ba6ofosjqqiya6empkyw6u5xdrtcfzi2evvyt4u6utzeiezyhi",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "infoURL": "https://numbersprotocol.io",
  "name": "Numbers Mainnet",
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "networkId": 10507,
  "rpc": [
    "https://numbers.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10507.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnetrpc.num.network"
  ],
  "shortName": "Jade",
  "slug": "numbers",
  "testnet": false
} as const satisfies Chain;