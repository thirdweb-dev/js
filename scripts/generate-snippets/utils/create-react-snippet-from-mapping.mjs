// Read in the react snippets
import reactSnippets from "../../../packages/react/docs/evm/snippets.json" assert { type: "json" };
import reactCoreSnippets from "../../../packages/react-core/docs/evm/snippets.json" assert { type: "json" };

// Takes in a two keys and returns the react snippet defined here for that value
// TODO: This logic **Probably** doesn't belong here.
// We should add some way of mapping this in the react SDK itself
// that way it is more maintainable.

const reactMapping = {
  NFTCollection: {
    mainHook: "useNFTCollection",
    subHooks: {
      // methods
      burn: "",
      getAll: "useNFTs",
      mintBatchTo: "",
      mintTo: "useMintNFT",
      balanceOf: "useNFTBalance",
      get: "useNFT",
      getOwned: "useOwnedNFTs",
      transfer: "",
      // properties
      royalties: "",
      signature: "",
    },
  },
  Edition: {
    mainHook: "useEdition",
    subHooks: {
      // methods
      burn: "",
      getAll: "useNFTs",
      getOwned: "useOwnedNFTs",
      mintBatchTo: "",
      mintTo: "useMintNFT",
      airdrop: "",
      balanceOf: "useNFTBalance",
      get: "useNFT",
      transfer: "",
      // properties
      royalties: "",
      signature: "",
    },
  },
  TokenDrop: {
    mainHook: "useTokenDrop",
    subHooks: {
      // methods
      burn: "",
      claimTo: "",
      allowance: "",
      allowanceOf: "",
      balance: "",
      balanceOf: "useTokenBalance",
      get: "",
      setAllowance: "",
      totalSupply: "",
      transfer: "",
      transferBatch: "",
      transferFrom: "",
      // properties
      claimConditions: "",
    },
  },
  Token: {
    mainHook: "useToken",
    subHooks: {
      // methods
      burn: "",
      burnFrom: "",
      mintBatchTo: "",
      mintTo: "",
      allowance: "",
      allowanceOf: "",
      balance: "",
      balanceOf: "useTokenBalance",
      get: "",
      setAllowance: "",
      totalSupply: "",
      transfer: "",
      transferBatch: "",
      transferFrom: "",
      // properties
      signature: "",
    },
  },
  NFTDrop: {
    mainHook: "useNFTDrop",
    subHooks: {
      // methods
      burn: "",
      claimTo: "useClaimNFT",
      createBatch: "",
      getAll: "useNFTs",
      getAllClaimed: "useClaimedNFTs",
      getAllUnclaimed: "useUnclaimedNFTs",
      getOwned: "useOwnedNFTs",
      totalClaimedSupply: "useClaimedNFTSupply",
      totalUnclaimedSupply: "useUnclaimedNFTSupply",
      balanceOf: "useNFTBalance",
      get: "useNFT",
      transfer: "",
      // properties
      claimConditions: "",
      revealer: "",
      royalties: "",
    },
  },
  EditionDrop: {
    mainHook: "useEditionDrop",
    subHooks: {
      // methods
      burn: "",
      claimTo: "useClaimNFT",
      createBatch: "",
      getAll: "useNFTs",
      getOwned: "",
      airdrop: "",
      balanceOf: "useNFTBalance",
      get: "",
      transfer: "",
      // properties
      claimConditions: "",
      royalties: "",
    },
  },
  Marketplace: {
    mainHook: "useMarketplace",
    subHooks: {
      // methods
      buyoutListing: "",
      getActiveListings: "useActiveListings",
      getAllListings: "useListings",
      getListing: "useListing",
      setBidBufferBps: "",
      setTimeBufferInsSeconds: "",
      // properties
      auction: "",
      direct: "",
    },
  },
  MarketplaceDirect: {
    mainHook: "useMarketplace",
    subHooks: {
      // methods
      acceptOffer: "",
      buyoutListing: "useBuyNow",
      cancelListing: "",
      createListing: "",
      makeOffer: "",
    },
  },
  MarketplaceAuction: {
    mainHook: "useMarketplace",
    subHooks: {
      // methods
      buyoutListing: "",
      cancelListing: "",
      closeListing: "",
      createListing: "",
      getWinner: "",
      getWinningBid: "useWinningBid",
      makeBid: "useMakeBid",
    },
  },
  Split: {
    mainHook: "useSplit",
    subHooks: {
      // methods
      balanceOf: "",
      balanceOfToken: "",
      distribute: "",
      distributeToken: "",
      getAllRecipients: "",
      withdraw: "",
    },
  },
  Pack: {
    mainHook: "usePack",
    subHooks: {
      // methods
      createTo: "",
      getAll: "useNFTs",
      getOwned: "useOwnedNFTs",
      getPackContents: "",
      open: "",
      airdrop: "",
      balanceOf: "useNFTBalance",
      get: "useNFT",
      transfer: "",
      // properties
      royalties: "",
    },
  },
  Vote: {
    mainHook: "useVote",
    subHooks: {
      // methods
      canExecute: "",
      execute: "",
      getAll: "",
      hasVoted: "",
      propose: "",
      vote: "",
    },
  },
  Multiwrap: {
    mainHook: "useMultiwrap",
    subHooks: {
      // methods
      getAll: "useNFTs",
      getWrappedContents: "",
      unwrap: "",
      wrap: "",
      balanceOf: "useNFTBalance",
      get: "useNFT",
      transfer: "",
    },
  },
  SignatureDrop: {
    mainHook: "useSignatureDrop",
    subHooks: {
      // methods
      claimTo: "useClaimNFT",
      createBatch: "",
      getAll: "useNFTs",
      getAllClaimed: "useClaimedNFTs",
      getAllUnclaimed: "useUnclaimedNFTs",
      getOwned: "useOwnedNFTs",
      totalClaimedSupply: "useClaimedNFTSupply",
      totalUnclaimedSupply: "useUnclaimedNFTSupply",
      balanceOf: "useNFTBalance",
      get: "useNFT",
      transfer: "",
      // properties
      claimConditions: "",
      revealer: "",
      royalties: "",
      signature: "",
    },
  },
  ContractEvents: {
    mainHook: "useAllContractEvents",
    subHooks: {
      // methods
      addEventListener: "useContractEvents",
      removeEventListener: "",
      addTransactionListener: "",
      getAllEvents: "useAllContractEvents",
      getEvents: "useContractEvents",
      listenToAllEvents: "useAllContractEvents",
      removeAllListeners: "",
      removeEventListener: "",
      removeTransactionListener: "",
    },
  },
  ContractMetadata: {
    mainHook: "useContractMetadata",
    subHooks: {
      // methods
      get: "useContractMetadata",
      set: "",
      update: "",
    },
  },
  ContractRoles: {
    mainHook: "useRoleMembers",
    subHooks: {
      // methods
      get: "useRoleMembers",
      getAll: "useAllRoleMembers",
      grant: "useGrantRole",
      revoke: "useRevokeRole",
      setAll: "useSetAllRoleMembers",
    },
  },
  SmartContract: {
    mainHook: "useContract",
    subHooks: {
      // methods
      call: "useContractWrite",
    },
  },
  UserWallet: {
    mainHook: "useContract",
    subHooks: {
      // methods
      getAddress: "useAddress",
    },
  },
  ThirdwebSDK: {
    mainHook: "useContract",
    subHooks: {
      // methods
      getContract: "useContract",
      call: "useContractWrite",
    },
  },
  SmartContract: {
    mainHook: "useContract",
    subHooks: {
      // methods
      call: "useContractWrite",
    },
  },
};

export default function createReactSnippet(contractName, methodName) {
  const mainHookName = reactMapping[contractName]?.mainHook;
  const reactSubhookName = reactMapping[contractName]?.subHooks[methodName];

  const snippets = { ...reactSnippets, ...reactCoreSnippets };
  const reactObject = snippets?.[mainHookName];

  const reactSubhooks = reactObject?.subhooks;

  const reactSnippet = reactSubhooks?.find((s) => s.name === reactSubhookName);

  return reactSnippet ? reactSnippet : {};
}
