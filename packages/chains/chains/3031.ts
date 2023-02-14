export default {
  "name": "Orlando Chain",
  "chain": "ORL",
  "rpc": [
    "https://orlando-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.orlchain.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Orlando",
    "symbol": "ORL",
    "decimals": 18
  },
  "infoURL": "https://orlchain.com",
  "shortName": "ORL",
  "chainId": 3031,
  "networkId": 3031,
  "icon": {
    "url": "ipfs://QmNsuuBBTHErnuFDcdyzaY8CKoVJtobsLJx2WQjaPjcp7g",
    "width": 512,
    "height": 528,
    "format": "png"
  },
  "explorers": [
    {
      "name": "Orlando (ORL) Explorer",
      "url": "https://orlscan.com",
      "icon": "orl",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "orlando-chain"
} as const;