export default {
  "name": "BOMB Chain Testnet",
  "chain": "BOMB",
  "rpc": [
    "https://bomb-chain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://bombchain-testnet.ankr.com/bas_full_rpc_1"
  ],
  "faucets": [
    "https://faucet.bombchain-testnet.ankr.com/"
  ],
  "nativeCurrency": {
    "name": "BOMB Token",
    "symbol": "tBOMB",
    "decimals": 18
  },
  "infoURL": "https://www.bombmoney.com",
  "shortName": "bombt",
  "chainId": 2399,
  "networkId": 2399,
  "icon": {
    "url": "ipfs://Qmc44uSjfdNHdcxPTgZAL8eZ8TLe4UmSHibcvKQFyGJxTB",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "explorers": [
    {
      "name": "bombscan-testnet",
      "icon": "bomb",
      "url": "https://explorer.bombchain-testnet.ankr.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "bomb-chain-testnet"
} as const;