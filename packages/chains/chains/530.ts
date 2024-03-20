import type { Chain } from "../src/types";
export default {
  "chain": "Fxcore",
  "chainId": 530,
  "explorers": [
    {
      "name": "FunctionX Explorer",
      "url": "https://fx-evm.functionx.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreifrf2iq3k3dqfbvp3pacwuxu33up3usmrhojt5ielyfty7xkixu3i",
    "width": 500,
    "height": 500,
    "format": "png"
  },
  "infoURL": "https://functionx.io/",
  "name": "F(x)Core Mainnet Network",
  "nativeCurrency": {
    "name": "Function X",
    "symbol": "FX",
    "decimals": 18
  },
  "networkId": 530,
  "rpc": [
    "https://530.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fx-json-web3.functionx.io:8545"
  ],
  "shortName": "FxCore",
  "slug": "f-x-core-network",
  "testnet": false
} as const satisfies Chain;