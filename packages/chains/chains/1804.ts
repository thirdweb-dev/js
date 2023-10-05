import type { Chain } from "../src/types";
export default {
  "chain": "CRC",
  "chainId": 1804,
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/kerleano",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://github.com/ethereum-pocr/kerleano/blob/main/docs/faucet.md"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
    "width": 334,
    "height": 360,
    "format": "png"
  },
  "infoURL": "https://github.com/ethereum-pocr/kerleano",
  "name": "Kerleano",
  "nativeCurrency": {
    "name": "Climate awaReness Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://kerleano.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cacib-saturn-test.francecentral.cloudapp.azure.com",
    "wss://cacib-saturn-test.francecentral.cloudapp.azure.com:9443"
  ],
  "shortName": "kerleano",
  "slug": "kerleano",
  "status": "active",
  "testnet": true
} as const satisfies Chain;