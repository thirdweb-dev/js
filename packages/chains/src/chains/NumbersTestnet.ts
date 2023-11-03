import type { Chain } from "../types";
export default {
  "chain": "NUM",
  "chainId": 10508,
  "explorers": [
    {
      "name": "ethernal",
      "url": "https://testnet.num.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=num",
    "https://faucet.num.network"
  ],
  "icon": {
    "url": "ipfs://bafkreie3ba6ofosjqqiya6empkyw6u5xdrtcfzi2evvyt4u6utzeiezyhi",
    "width": 1500,
    "height": 1500,
    "format": "png"
  },
  "infoURL": "https://numbersprotocol.io",
  "name": "Numbers Testnet",
  "nativeCurrency": {
    "name": "NUM Token",
    "symbol": "NUM",
    "decimals": 18
  },
  "networkId": 10508,
  "rpc": [
    "https://numbers-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://10508.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetrpc.num.network"
  ],
  "shortName": "Snow",
  "slug": "numbers-testnet",
  "testnet": true
} as const satisfies Chain;