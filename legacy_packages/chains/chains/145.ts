import type { Chain } from "../src/types";
export default {
  "chain": "SETH",
  "chainId": 145,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.soraai.bot",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmdwQDr6vmBtXmK2TmknkEuZNoaDqTasFdZdu3DRw8b2wt",
    "width": 1000,
    "height": 1628,
    "format": "png"
  },
  "infoURL": "https://soraai.bot",
  "name": "SoraAI Testnet",
  "nativeCurrency": {
    "name": "SoraETH",
    "symbol": "SETH",
    "decimals": 18
  },
  "networkId": 145,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.soraai.bot"
      }
    ]
  },
  "rpc": [
    "https://145.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.soraai.bot"
  ],
  "shortName": "SETH",
  "slip44": 1,
  "slug": "soraai-testnet",
  "testnet": true
} as const satisfies Chain;