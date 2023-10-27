import type { Chain } from "../src/types";
export default {
  "chain": "WAGMI",
  "chainId": 11111,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets-test.avax.network/wagmi",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.avax.network/?subnet=wagmi"
  ],
  "icon": {
    "url": "ipfs://QmNoyUXxnak8B3xgFxErkVfyVEPJUMHBzq7qJcYzkUrPR4",
    "width": 1920,
    "height": 1920,
    "format": "png"
  },
  "infoURL": "https://subnets-test.avax.network/wagmi/details",
  "name": "WAGMI",
  "nativeCurrency": {
    "name": "WAGMI",
    "symbol": "WGM",
    "decimals": 18
  },
  "networkId": 11111,
  "rpc": [
    "https://wagmi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://11111.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/wagmi/wagmi-chain-testnet/rpc"
  ],
  "shortName": "WAGMI",
  "slug": "wagmi",
  "testnet": true
} as const satisfies Chain;