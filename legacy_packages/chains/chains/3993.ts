import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 3993,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://exp-testnet.apexlayer.xyz",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sepoliafaucet.com/"
  ],
  "infoURL": "https://docs.apexlayer.xyz/",
  "name": "APEX Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 3993,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://apexlayer.xyz/bridge"
      }
    ]
  },
  "rpc": [
    "https://3993.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.apexlayer.xyz"
  ],
  "shortName": "apexsep",
  "slip44": 1,
  "slug": "apex-testnet",
  "testnet": true
} as const satisfies Chain;