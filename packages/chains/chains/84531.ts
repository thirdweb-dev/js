import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 84531,
  "explorers": [
    {
      "name": "basescan",
      "url": "https://goerli.basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base-goerli.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "dexguru",
      "url": "https://base-goerli.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
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
  "networkId": 84531,
  "redFlags": [],
  "rpc": [
    "https://base-goerli.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://84531.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://goerli.base.org",
    "https://base-goerli.gateway.tenderly.co",
    "wss://base-goerli.gateway.tenderly.co",
    "https://base-goerli.publicnode.com",
    "wss://base-goerli.publicnode.com"
  ],
  "shortName": "basegor",
  "slip44": 1,
  "slug": "base-goerli",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;