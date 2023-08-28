import type { Chain } from "../src/types";
export default {
  "name": "Base Goerli Testnet",
  "chain": "ETH",
  "rpc": [
    "https://base-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://base-goerli.publicnode.com",
    "wss://base-goerli.gateway.tenderly.co",
    "https://base-goerli.gateway.tenderly.co",
    "https://goerli.base.org"
  ],
  "faucets": [
    "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
  ],
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://base.org",
  "shortName": "basegor",
  "chainId": 84531,
  "networkId": 84531,
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "height": 512,
    "width": 512,
    "format": "png"
  },
  "explorers": [
    {
      "name": "basescout",
      "url": "https://base-goerli.blockscout.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    },
    {
      "name": "basescan",
      "url": "https://goerli.basescan.org",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "base-goerli"
} as const satisfies Chain;