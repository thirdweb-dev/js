import {
  TokenERC721__factory,
  DropERC721__factory,
  DropERC721_V3__factory,
  IERC721A__factory,
  IDrop__factory,
  IDrop1155__factory,
  TokenERC20__factory,
  ISignatureMintERC20__factory,
  DropERC1155__factory,
  IERC1155__factory,
} from "@thirdweb-dev/contracts-js";
import {
  detectFeatures,
  getAllDetectedExtensionNames,
  isExtensionEnabled,
  matchesAbiFromBytecode,
} from "../../src/evm";
import { extractMinimalProxyImplementationAddress } from "../../src/evm/common/feature-detection/extractMinimalProxyImplementationAddress";
import { signers, sdk } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";

describe("Feature Detection", async () => {
  let adminWallet: SignerWithAddress;

  before(async () => {
    [adminWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
  });

  it("should extract implementation address for eip-1167 minimal proxy", async () => {
    // https://eips.ethereum.org/EIPS/eip-1167#specification
    const code =
      "0x363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for eip-7511 minimal proxy", async () => {
    // https://eips.ethereum.org/EIPS/eip-7511#specification
    const code =
      "0x365f5f375f5f365f73bebebebebebebebebebebebebebebebebebebebe5af43d5f5f3e5f3d91602a57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for minimal proxy with receive", async () => {
    // https://github.com/0xSplits/splits-contracts/blob/c7b741926ec9746182d0d1e2c4c2046102e5d337/contracts/libraries/Clones.sol#L32
    const code =
      "0x36603057343d52307f830d2d700a97af574b186c80d40429385d24241565b08a7c559ba283a964d9b160203da23d3df35b3d3d3d3d363d3d37363d73bebebebebebebebebebebebebebebebebebebebe5af43d3d93803e605b57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for more minimal proxy", async () => {
    // https://medium.com/coinmonks/the-more-minimal-proxy-5756ae08ee48
    const code =
      "0x3d3d3d3d363d3d37363d73bebebebebebebebebebebebebebebebebebebebe5af43d3d93803e602a57fd5bf3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for older vyper (uniswap v1) proxy", async () => {
    const code =
      "0x366000600037611000600036600073bebebebebebebebebebebebebebebebebebebebe5af41558576110006000f3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract implementation address for new minimal proxy pattern", async () => {
    const code =
      "0x36600080376020600036600073bebebebebebebebebebebebebebebebebebebebe6102c65a03f41515602d57fe5b60206000f3";
    const implementationAddress =
      extractMinimalProxyImplementationAddress(code);
    expect(implementationAddress).to.equal(
      "0xbebebebebebebebebebebebebebebebebebebebe",
    );
  });

  it("should extract features", async () => {
    let features = detectFeatures(TokenERC721__factory.abi);
    expect(
      isExtensionEnabled(
        TokenERC721__factory.abi,
        "ERC721Enumerable",
        features,
      ),
    ).to.eq(true);
    expect(
      isExtensionEnabled(TokenERC721__factory.abi, "ERC721Mintable", features),
    ).to.eq(true);
    expect(
      isExtensionEnabled(
        TokenERC721__factory.abi,
        "ERC721BatchMintable",
        features,
      ),
    ).to.eq(true);

    // Drop
    features = detectFeatures(DropERC721__factory.abi);
    expect(
      isExtensionEnabled(
        DropERC721__factory.abi,
        "ERC721ClaimPhasesV2",
        features,
      ),
    ).to.eq(true);
    expect(
      isExtensionEnabled(DropERC721__factory.abi, "ERC721Supply", features),
    ).to.eq(true);
    expect(
      isExtensionEnabled(DropERC721__factory.abi, "ERC721Mintable", features),
    ).to.eq(false);
  });

  it("should extract all features", async () => {
    const tokenFeatures = getAllDetectedExtensionNames(
      TokenERC721__factory.abi,
    );
    expect(tokenFeatures).to.contain("ERC721Enumerable");
    expect(getAllDetectedExtensionNames(DropERC721__factory.abi)).to.contain(
      "ERC721ClaimPhasesV2",
    );
    expect(getAllDetectedExtensionNames(DropERC721_V3__factory.abi)).to.contain(
      "ERC721ClaimPhasesV1",
    );
  });

  it("should match abis from bytecode 2", async () => {
    let matches = matchesAbiFromBytecode(TokenERC20__factory.bytecode, [
      ISignatureMintERC20__factory.abi,
    ]);
    expect(matches).to.eq(true);
    matches = matchesAbiFromBytecode(DropERC721__factory.bytecode, [
      IERC721A__factory.abi,
      IDrop__factory.abi,
    ]);
    expect(matches).to.eq(true);

    matches = matchesAbiFromBytecode(DropERC1155__factory.bytecode, [
      IERC1155__factory.abi,
    ]);
    expect(matches).to.eq(true);
  });

  it("should not match abi from bytecode", async () => {
    const matches = matchesAbiFromBytecode(DropERC721__factory.bytecode, [
      IDrop1155__factory.abi,
    ]);
    expect(matches).to.eq(false);
  });
});
