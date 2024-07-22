import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 8453,
  "contracts": {
    "l1Contracts": {
      "L1StandardBridgeProxy": "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
      "L2OutputOracleProxy": "0x56315b90c40730925ec5485cf004d835058518A0",
      "OptimismPortalProxy": "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e",
      "AddressManager": "0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2",
      "L1CrossDomainMessenger": "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa",
      "L1ERC721Bridge": "0x608d94945A64503E642E6370Ec598e519a2C1E53",
      "L1StandardBridge": "0x3154Cf16ccdb4C6d922629664174b904d80F2C35",
      "L2OutputOracle": "0x56315b90c40730925ec5485cf004d835058518A0",
      "OptimismMintableERC20Factory": "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84",
      "OptimismPortal": "0x49048044D57e1C92A77f79988d21Fa8fAF74E97e",
      "ProxyAdmin": "0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E",
      "SystemConfig": "0x73a79Fab69143498Ed3712e519A88a918e1f4072"
    }
  },
  "explorers": [
    {
      "name": "basescan",
      "url": "https://basescan.org",
      "standard": "none"
    },
    {
      "name": "basescout",
      "url": "https://base.blockscout.com",
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
      "url": "https://base.dex.guru",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRaASKRSjQ5btoUQ2rNTJNxKtx2a2RoewgA7DMQkLVEne",
        "width": 83,
        "height": 82,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmW5Vn15HeRkScMfPcW12ZdZcC2yUASpu6eCsECRdEmjjj/base-512.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://base.org",
  "name": "Base",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 8453,
  "redFlags": [],
  "rpc": [
    "https://8453.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.base.org/",
    "https://developer-access-mainnet.base.org/",
    "https://base.gateway.tenderly.co",
    "wss://base.gateway.tenderly.co",
    "https://base-rpc.publicnode.com",
    "wss://base-rpc.publicnode.com"
  ],
  "shortName": "base",
  "slug": "base",
  "stackInfo": {
    "parentChainId": 1,
    "nativeTokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  },
  "stackType": "optimism_bedrock",
  "status": "active",
  "testnet": false
} as const satisfies Chain;