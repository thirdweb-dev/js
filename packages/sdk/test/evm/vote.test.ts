import { Token, TokenInitializer, Vote, VoteInitializer } from "../../src/evm";
import { sdk, signers, hardhatEthers } from "./before-setup";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";
import { ethers } from "ethers";

describe("Vote Contract", async () => {
  let voteContract: Vote;
  let currencyContract: Token;

  // const voteStartWaitTimeInSeconds = 0;
  // const voteWaitTimeInSeconds = 5;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);

    const tokenContractAddress = await sdk.deployer.deployBuiltInContract(
      TokenInitializer.contractType,
      {
        name: "DAOToken #1",
        symbol: "DAO1",
        primary_sale_recipient: adminWallet.address,
      },
    );
    currencyContract = await sdk.getToken(tokenContractAddress);
    const voteContractAddress = await sdk.deployer.deployBuiltInContract(
      VoteInitializer.contractType,
      {
        name: "DAO #1",
        voting_token_address: currencyContract.getAddress(),
        voting_quorum_fraction: 1,
        proposal_token_threshold: ethers.utils.parseUnits("1", 18),
      },
    );
    voteContract = await sdk.getVote(voteContractAddress);

    // step 1: mint 1000 governance tokens to my wallet
    await currencyContract.mintTo(samWallet.address, "100");

    // step 35: later grant role to the vote contract, so the contract can mint more tokens
    // should be separate function since you need gov token to deploy vote contract
    await currencyContract.roles.grant("minter", voteContract.getAddress());

    await sdk.updateSignerOrProvider(samWallet);

    // step 2: delegate the governance token to someone for voting. in this case, myself.
    await currencyContract.delegateTo(samWallet.address);
  });

  it("should permit a proposal to be passed if it receives the right votes", async () => {
    await sdk.updateSignerOrProvider(samWallet);
    await currencyContract.delegateTo(samWallet.address);

    const proposalId = (
      await voteContract.propose("Mint Tokens", [
        {
          toAddress: currencyContract.getAddress(),
          nativeTokenValue: 0,
          transactionData: currencyContract.encoder.encode("mintTo", [
            bobWallet.address,
            ethers.utils.parseUnits("1", 18),
          ]),
        },
      ])
    ).id;

    await voteContract.vote(
      proposalId.toString(),

      // 0 = Against, 1 = For, 2 = Abstain
      1,

      // optional reason, be mindful more character count = more gas.
      "Reason + Gas :)",
    );

    // increment 10 blocks
    for (let i = 0; i < 10; i++) {
      await hardhatEthers.provider.send("evm_mine", []);
    }

    // Step 3: Execute the proposal if it is expired and passed
    await voteContract.execute(proposalId.toString());

    const balanceOfBobsWallet = await currencyContract.balanceOf(
      bobWallet.address,
    );

    assert.equal(balanceOfBobsWallet.displayValue, "1.0");
  });
  it("should be able to execute proposal even when `executions` is not passed", async () => {
    await sdk.updateSignerOrProvider(samWallet);
    await currencyContract.delegateTo(samWallet.address);
    const proposalId = (await voteContract.propose("Mint Tokens")).id;
    await voteContract.vote(proposalId.toString(), 1);

    for (let i = 0; i < 10; i++) {
      await hardhatEthers.provider.send("evm_mine", []);
    }

    await voteContract.execute(proposalId.toString());
  });
  it.skip("", async () => {
    const blockTimes = [] as number[];
    const provider = ethers.getDefaultProvider();

    const latest = await provider.getBlock("latest");
    for (let i = 0; i <= 10; i++) {
      const current = await provider.getBlock(latest.number - i);
      const previous = await provider.getBlock(latest.number - i - 1);
      const diff = current.timestamp - previous.timestamp;
      blockTimes.push(diff);
    }

    // const sum = blockTimes.reduce((result, a) => result + a, 0);
  });

  it("should permit a proposal to be passed if it receives the right votes", async () => {
    await sdk.updateSignerOrProvider(samWallet);
    const description = "Mint Tokens";
    const proposalId = (
      await voteContract.propose(description, [
        {
          toAddress: currencyContract.getAddress(),
          nativeTokenValue: 0,
          transactionData: currencyContract.encoder.encode("mintTo", [
            bobWallet.address,
            ethers.utils.parseUnits("1", 18),
          ]),
        },
      ])
    ).id;
    const proposal = await voteContract.get(proposalId);
    assert.equal(proposal.description, description);
  });

  it("should permit a proposal with native token values to be passed if it receives the right votes", async () => {
    await sdk.updateSignerOrProvider(samWallet);
    await currencyContract.delegateTo(samWallet.address);

    await samWallet.sendTransaction({
      to: voteContract.getAddress(),
      value: ethers.utils.parseUnits("2", 18),
    });

    assert.equal(
      (
        await sdk.getProvider().getBalance(voteContract.getAddress())
      ).toString(),
      ethers.utils.parseUnits("2", 18).toString(),
    );

    const proposalId = (
      await voteContract.propose("Transfer 1 ETH", [
        {
          toAddress: bobWallet.address,
          nativeTokenValue: ethers.utils.parseUnits("1", 18),
          transactionData: "0x",
        },
      ])
    ).id;

    await voteContract.vote(
      proposalId.toString(),

      // 0 = Against, 1 = For, 2 = Abstain
      1,

      // optional reason, be mindful more character count = more gas.
      "Reason + Gas :)",
    );

    // increment 10 blocks
    for (let i = 0; i < 10; i++) {
      await hardhatEthers.provider.send("evm_mine", []);
    }

    const balanceOfBobsWalletBefore = await bobWallet.getBalance();

    // Step 3: Execute the proposal if it is expired and passed
    await voteContract.execute(proposalId.toString());

    const balanceOfBobsWallet = await bobWallet.getBalance();

    assert.equal(
      balanceOfBobsWallet.sub(balanceOfBobsWalletBefore).toString(),
      ethers.utils.parseUnits("1", 18).toString(),
    );
  });
});
