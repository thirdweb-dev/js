import type { Chain } from "../src/types";
export default {
  "chainId": 1804,
  "chain": "CRC",
  "name": "Kerleano",
  "rpc": [
    "https://kerleano.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cacib-saturn-test.francecentral.cloudapp.azure.com",
    "wss://cacib-saturn-test.francecentral.cloudapp.azure.com:9443"
  ],
  "slug": "kerleano",
  "icon": {
    "url": "ipfs://QmRLwpq47tyEd3rfK4tKRhbTvyb3fc7PCutExnL1XAb37A",
    "width": 334,
    "height": 360,
    "format": "png"
  },
  "faucets": [
    "https://github.com/ethereum-pocr/kerleano/blob/main/docs/faucet.md"
  ],
  "nativeCurrency": {
    "name": "Climate awaReness Coin",
    "symbol": "CRC",
    "decimals": 18
  },
  "infoURL": "https://github.com/ethereum-pocr/kerleano",
  "shortName": "kerleano",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "Lite Explorer",
      "url": "https://ethereum-pocr.github.io/explorer/kerleano",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;