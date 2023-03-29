export default {
  "name": "WAGMI",
  "chain": "WAGMI",
  "icon": {
    "url": "ipfs://QmNoyUXxnak8B3xgFxErkVfyVEPJUMHBzq7qJcYzkUrPR4",
    "width": 1920,
    "height": 1920,
    "format": "png"
  },
  "rpc": [
    "https://wagmi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/wagmi/wagmi-chain-testnet/rpc"
  ],
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
  "chainId": 11111,
  "networkId": 11111,
  "explorers": [
    {
      "name": "Avalanche Subnet Explorer",
      "url": "https://subnets-test.avax.network/wagmi",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "wagmi"
} as const;