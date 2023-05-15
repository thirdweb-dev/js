import { Core } from "@walletconnect/core";
import { Web3Wallet } from "@walletconnect/web3wallet";
import { SessionTypes } from "@walletconnect/types";
import { buildApprovedNamespaces, getSdkError } from "@walletconnect/utils";
import { ethers } from "ethers";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";

export class WCWallet {
  public core;
  public web3wallet: InstanceType<typeof Web3Wallet> | undefined;
  public session: SessionTypes.Struct | undefined;

  constructor() {
    this.core = new Core({
      projectId: "145769e410f16970a79ff77b2d89a1e0",
      relayUrl: "wss://relay.walletconnect.com",
    });
  }

  async init() {
    const myCore = this.core;
    this.web3wallet = await Web3Wallet.init({
      core: myCore, // <- pass the shared `core` instance
      metadata: {
        name: "Thirdweb Wallet",
        description: "Thirdweb Wallet",
        url: "https://thirdweb.com",
        icons: [""],
      },
    });
  }

  async getActiveSessions() {
    if (!this.web3wallet) {
      throw new Error("Web3Wallet not initialized");
    }

    return this.web3wallet.getActiveSessions();
  }

  async pair(
    wallet: AbstractClientWallet,
    uri: string,
  ): Promise<{ name: string; iconUrl: string }> {
    return new Promise<{ name: string; iconUrl: string }>(async (resolve) => {
      if (!this.web3wallet) {
        throw new Error("Web3Wallet not initialized");
      }

      this.web3wallet.getActiveSessions();

      console.log("wallet.getAddress();");
      const address = await wallet.getAddress();

      console.log("address", address);

      const that = this;
      this.web3wallet?.on("session_proposal", async (proposal) => {
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: proposal.params,
          supportedNamespaces: {
            eip155: {
              chains: ["eip155:1", "eip155:137", "eip155:5"],
              methods: ["eth_sendTransaction", "personal_sign"],
              events: ["accountsChanged", "chainChanged"],
              accounts: [`eip155:1:${address}`, `eip155:5:${address}`],
            },
          },
        });

        console.log("approveSession");
        // these can be multiple sessions
        that.session = await that.web3wallet?.approveSession({
          id: proposal.id,
          namespaces: approvedNamespaces,
        });

        console.log("that.session", that.session?.peer.metadata.name);
        console.log("that.session", that.session?.peer.metadata.icons[0]);

        if (that.session) {
          resolve({
            name: that.session?.peer.metadata.name,
            iconUrl: that.session?.peer.metadata.icons[0],
          });
        }
      });

      this.web3wallet.on("session_request", async (event) => {
        console.log("session_request");
        const { topic, params, id } = event;
        const { request } = params;
        const requestParamsMessage = request.params[0];

        // convert `requestParamsMessage` by using a method like hexToUtf8
        const message = ethers.utils.toUtf8String(requestParamsMessage);

        console.log("signed message");

        // sign the message
        const signedMessage = await wallet.signMessage(message);

        console.log("signedMessage", signedMessage);

        const response = { id, result: signedMessage, jsonrpc: "2.0" };

        await that.web3wallet?.respondSessionRequest({ topic, response });
      });

      console.log("pair");
      await this.web3wallet.core.pairing.pair({ uri });
    });
  }

  async approveSession() {}

  async rejectSession() {
    if (!this.web3wallet) {
      throw new Error("Web3Wallet not initialized");
    }

    const that = this;
    const web3wallet = this.web3wallet;
    this.web3wallet.on("session_proposal", async (proposal) => {
      await web3wallet.rejectSession({
        id: proposal.id,
        reason: getSdkError("USER_REJECTED_METHODS"),
      });

      that.session = undefined;
    });
  }

  async disconnect() {
    if (!this.web3wallet) {
      throw new Error("Web3Wallet not initialized");
    }
    if (!this.session) {
      throw new Error("Session not started");
    }
    const topic = this.session.topic;
    await this.web3wallet.disconnectSession({
      topic: topic,
      reason: getSdkError("USER_DISCONNECTED"),
    });
  }
}
