import type { Chain } from "../src/types";
export default {
  "chainId": 530,
  "chain": "Fxcore",
  "name": "F(x)Core Mainnet Network",
  "rpc": [
    "https://f-x-core-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fx-json-web3.functionx.io:8545"
  ],
  "slug": "f-x-core-network",
  "icon": {
    "url": "ipfs://bafkreifrf2iq3k3dqfbvp3pacwuxu33up3usmrhojt5ielyfty7xkixu3i",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Function X",
    "symbol": "FX",
    "decimals": 18
  },
  "infoURL": "https://functionx.io/",
  "shortName": "FxCore",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "FunctionX Explorer",
      "url": "https://fx-evm.functionx.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;