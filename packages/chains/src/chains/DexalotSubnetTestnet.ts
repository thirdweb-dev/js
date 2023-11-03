import type { Chain } from "../types";
export default {
  "chain": "DEXALOT",
  "chainId": 432201,
  "explorers": [
    {
      "name": "Avalanche Subnet Testnet Explorer",
      "url": "https://subnets-test.avax.network/dexalot",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=dexalot"
  ],
  "icon": {
    "url": "ipfs://QmfVxdrWjtUKiGzqFDzAxHH2FqwP2aRuZTGcYWdWg519Xy",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://dexalot.com",
  "name": "Dexalot Subnet Testnet",
  "nativeCurrency": {
    "name": "Dexalot",
    "symbol": "ALOT",
    "decimals": 18
  },
  "networkId": 432201,
  "rpc": [
    "https://dexalot-subnet-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://432201.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/dexalot/testnet/rpc"
  ],
  "shortName": "dexalot-testnet",
  "slug": "dexalot-subnet-testnet",
  "testnet": true
} as const satisfies Chain;