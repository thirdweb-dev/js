import type { Chain } from "../src/types";
export default {
  "chainId": 11111,
  "chain": "WAGMI",
  "name": "WAGMI",
  "rpc": [
    "https://wagmi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/wagmi/wagmi-chain-testnet/rpc"
  ],
  "slug": "wagmi",
  "icon": {
    "url": "ipfs://QmNoyUXxnak8B3xgFxErkVfyVEPJUMHBzq7qJcYzkUrPR4",
    "width": 1920,
    "height": 1920,
    "format": "png"
  },
  "faucets": [
    "https://faucet.avax.network/?subnet=wagmi"
  ],
  "nativeCurrency": {
    "name": "WAGMI",
    "symbol": "WGM",
    "decimals": 18
  },
  "infoURL": "https://subnets-test.avax.network/wagmi/details",
  "shortName": "WAGMI",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets-test.avax.network/wagmi",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;