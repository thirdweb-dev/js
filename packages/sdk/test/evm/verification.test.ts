import dotenv from "dotenv";
import {
  isVerifiedOnEtherscan,
  verify,
} from "../../src/evm/common/verification";
import { assert } from "chai";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

dotenv.config();

describe("Contract Verification", async () => {
  const api = "https://api-goerli.etherscan.io/api";
  const apiKey = process.env.API_KEY as string;
  before(async () => {});
  beforeEach(async () => {});
  it("should correctly return if a contract is verified or not", async () => {
    // check verification for a verified thirdweb contract
    let contractAddress = "0x135fC9D26E5eC51260ece1DF4ED424E2f55c7766";
    const etherscanResultTWContract = await isVerifiedOnEtherscan(
      contractAddress,
      api,
      apiKey,
    );
    assert.isTrue(etherscanResultTWContract);

    // check for a non-thirdweb verified contract -- WETH in this case
    contractAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
    const etherscanResultForNonTWContract = await isVerifiedOnEtherscan(
      contractAddress,
      api,
      apiKey,
    );
    assert.isTrue(etherscanResultForNonTWContract);
  });
  it("should verify a contract", async () => {
    const storage = new ThirdwebStorage();
    const chainId = 84531;

    const contractAddress = "0xc049BFBe9b4436D06122417756DC9De3aD282699";
    const result = await verify(contractAddress, chainId, api, apiKey, storage);
    console.log(result);
  });
  it("should check verification status", async () => {});
});
