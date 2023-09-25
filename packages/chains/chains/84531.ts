import type { Chain } from "../src/types";
export default {
  "chainId": 84531,
  "chain": "ETH",
  "name": "Base Goerli Testnet",
  "rpc": [
    "https://base-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "wss://base-goerli.publicnode.com",
    "https://base-goerli.publicnode.com",
    "wss://base-goerli.gateway.tenderly.co",
    "https://base-goerli.gateway.tenderly.co",
    "https://goerli.base.org"
  ],
  "slug": "base-goerli",
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "basescan",
      "url": "https://goerli.basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base-goerli.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;