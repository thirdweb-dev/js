import type { Chain } from "../src/types";
export default {
  "chain": "Ancient8",
  "chainId": 888888888,
  "contracts": {
    "l1Contracts": {
      "L1StandardBridgeProxy": "0xd5e3eDf5b68135D559D572E26bF863FBC1950033",
      "L2OutputOracleProxy": "0xB09DC08428C8b4EFB4ff9C0827386CDF34277996",
      "OptimismPortalProxy": "0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68",
      "AddressManager": "0x15A52Fed1c448028A240b603dD93f2697E12Dc82",
      "L1CrossDomainMessengerProxy": "0x012c341506ee1939e56084F43Ae5dbCe224Ce2af",
      "L1ERC721Bridge": "0x132b3456300332d488f946B818eB9512931eBCAa",
      "OptimismMintableERC20FactoryProxy": "0xF2b7b677d14F4F570D084d7d615254F984e7089E",
      "ProxyAdmin": "0x75a223Fb459461B9Fa61dd25109EA05522b4b492",
      "SystemConfigProxy": "0x0b4cfc49aCc656CE6D03CB0794860Da92bE3E8ec"
    }
  },
  "explorers": [
    {
      "name": "Ancient8 Explorer",
      "url": "https://scan.ancient8.gg",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreievnqg3xjokaty4kfbxxbrzm5v5y7exbaaia2txrh4sfgrqsalfym",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://ancient8.gg/",
  "name": "Ancient8",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 888888888,
  "redFlags": [],
  "rpc": [
    "https://888888888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ancient8.gg"
  ],
  "shortName": "ancient8",
  "slug": "ancient8",
  "stackInfo": {
    "parentChainId": 1,
    "nativeTokenAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
  },
  "stackType": "optimism_bedrock",
  "testnet": false
} as const satisfies Chain;