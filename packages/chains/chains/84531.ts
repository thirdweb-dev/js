import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 84531,
  "explorers": [
    {
      "name": "basescout",
      "url": "https://base-goerli.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "basescan",
      "url": "https://goerli.basescan.org",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://www.coinbase.com/faucets/base-ethereum-goerli-faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://base.org",
  "name": "Base Goerli Testnet",
  "nativeCurrency": {
    "name": "Goerli Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://base-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://base-goerli.publicnode.com",
    "https://base-goerli.publicnode.com",
    "wss://base-goerli.gateway.tenderly.co",
    "https://base-goerli.gateway.tenderly.co",
    "https://goerli.base.org"
  ],
  "shortName": "basegor",
  "slug": "base-goerli",
  "testnet": true
} as const satisfies Chain;