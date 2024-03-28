import { ThirdwebAuth } from "../src/core";
import { EthersWallet } from "@thirdweb-dev/wallets/evm/wallets/ethers";
import { expect } from "chai";
import { Wallet } from "ethers";

require("dotenv-mono").load();

describe("Wallet Authentication - EVM", async () => {
  let adminWallet: any, signerWallet: any, attackerWallet: any;
  let auth: ThirdwebAuth;

  before(async () => {
    const [adminSigner, signerSigner, attackerSigner] = [
      Wallet.createRandom(),
      Wallet.createRandom(),
      Wallet.createRandom(),
    ];

    adminWallet = new EthersWallet(adminSigner);
    signerWallet = new EthersWallet(signerSigner);
    attackerWallet = new EthersWallet(attackerSigner);

    auth = new ThirdwebAuth(signerWallet, "thirdweb.com", {
      secretKey: process.env.TW_SECRET_KEY,
    });
  });

  beforeEach(async () => {
    auth.updateWallet(signerWallet);
  });

  it("Should verify logged in wallet", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const address = await auth.verify(payload);

    expect(address).to.equal(await signerWallet.getAddress());
  });

  it("Should verify logged in wallet with chain ID and expiration", async () => {
    const payload = await auth.login({
      expirationTime: new Date(Date.now() + 1000 * 60 * 5),
      chainId: "137",
    });

    auth.updateWallet(adminWallet);
    const address = await auth.verify(payload, {
      chainId: "137",
    });

    expect(address).to.equal(await signerWallet.getAddress());
  });

  it("Should verify payload with resources", async () => {
    const payload = await auth.login({
      resources: ["https://example.com", "https://test.com"],
    });

    auth.updateWallet(adminWallet);
    const address = await auth.verify(payload, {
      resources: ["https://example.com", "https://test.com"],
    });

    expect(address).to.equal(await signerWallet.getAddress());
  });

  it("Should reject payload without necessary resources", async () => {
    const payload = await auth.login({
      resources: ["https://example.com"],
    });

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload, {
        resources: ["https://example.com", "https://test.com"],
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Login request is missing required resources: https://test.com",
      );
    }
  });

  it("Should verify payload with customized statement", async () => {
    const payload = await auth.login({
      statement: "Please sign!",
    });

    auth.updateWallet(adminWallet);
    const address = await auth.verify(payload, {
      statement: "Please sign!",
    });

    expect(address).to.equal(await signerWallet.getAddress());
  });

  it("Should reject payload with incorrect statement", async () => {
    const payload = await auth.login({
      statement: "Please sign!",
    });

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload, {
        statement: "Please sign again!",
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.include(
        "Expected statement 'Please sign again!' does not match statement on payload",
      );
    }
  });

  it("Should reject invalid nonce", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload, {
        validateNonce: (nonce: string) => {
          if (nonce === payload.payload.nonce) {
            throw new Error();
          }
        },
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal("Login request nonce is invalid");
    }
  });

  it("Should accept valid nonce", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const address = await auth.verify(payload, {
      validateNonce: (nonce: string) => {
        if (nonce !== payload.payload.nonce) {
          throw new Error();
        }
      },
    });

    expect(address).to.equal(await signerWallet.getAddress());
  });

  it("Should reject payload with incorrect domain", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload, { domain: "test.thirdweb.com" });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Expected domain 'test.thirdweb.com' does not match domain on payload 'thirdweb.com'",
      );
    }
  });

  it("Should reject expired login payload", async () => {
    const payload = await auth.login({
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal("Login request has expired");
    }
  });

  it("Should reject payload with incorrect chain ID", async () => {
    const payload = await auth.login({
      chainId: "1",
    });

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload, {
        chainId: "137",
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.equal(
        "Expected chain ID '137' does not match chain ID on payload '1'",
      );
    }
  });

  it("Should reject payload with incorrect signer", async () => {
    const payload = await auth.login();
    payload.payload.address = await attackerWallet.getAddress();

    auth.updateWallet(adminWallet);
    try {
      await auth.verify(payload);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("does not match payload address");
    }
  });

  it("Should generate valid authentication token", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);
    const user = await auth.authenticate(token);

    expect(user.address).to.equal(await signerWallet.getAddress());
  });

  it("Should reject token with incorrect domain", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);

    try {
      await auth.authenticate(token, { domain: "test.thirdweb.com" });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain(
        "Expected token to be for the domain 'test.thirdweb.com', but found token with domain 'thirdweb.com'",
      );
    }
  });

  it("Should reject token before invalid before", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      invalidBefore: new Date(Date.now() + 1000 * 60 * 5),
    });

    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("This token is invalid before");
    }
  });

  it("Should reject expired authentication token", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      expirationTime: new Date(Date.now() - 1000 * 60 * 5),
    });

    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("This token expired");
    }
  });

  it("Should reject if admin address is not connected wallet address", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);

    auth.updateWallet(signerWallet);
    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain(
        `The expected issuer address '${await signerWallet.getAddress()}' did not match the token issuer address '${await adminWallet.getAddress()}'`,
      );
    }
  });

  it("Should accept token with valid token ID", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      tokenId: "test",
    });

    const user = await auth.authenticate(token, {
      validateTokenId: (tokenId: string) => {
        if (tokenId !== "test") {
          throw new Error();
        }
      },
    });

    expect(user.address).to.equal(await signerWallet.getAddress());
  });

  it("Should reject token with invalid token ID", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      tokenId: "test",
    });

    try {
      await auth.authenticate(token, {
        validateTokenId: (tokenId: string) => {
          if (tokenId !== "invalid") {
            throw new Error();
          }
        },
      });
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("Token ID is invalid");
    }
  });

  it("Should propagate session on token", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      session: { role: "admin" },
    });

    const user = await auth.authenticate(token);

    expect(user.address).to.equal(await signerWallet.getAddress());
    expect(user.session).to.deep.equal({ role: "admin" });
  });

  it("Should call session callback function", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload, {
      session: (address: string) => {
        return { address, role: "admin" };
      },
    });

    const user = await auth.authenticate(token);

    expect(user.address).to.equal(await signerWallet.getAddress());
    expect(user.session).to.deep.equal({
      address: await signerWallet.getAddress(),
      role: "admin",
    });
  });

  it("Should authenticate with issuer address", async () => {
    const payload = await auth.login();

    auth.updateWallet(adminWallet);
    const token = await auth.generate(payload);

    auth.updateWallet(attackerWallet);
    try {
      await auth.authenticate(token);
      expect.fail();
    } catch (err: any) {
      expect(err.message).to.contain("The expected issuer address");
    }

    const user = await auth.authenticate(token, {
      issuerAddress: await adminWallet.getAddress(),
    });
    expect(user.address).to.equal(await signerWallet.getAddress());
  });
});
