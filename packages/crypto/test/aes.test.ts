import { aesEncrypt, aesDecrypt, aesDecryptCompat } from "../src";

import { AES } from "crypto-js";

describe("AES", () => {
  describe("modern", () => {
    it("should properly encrypt and decrypt", async () => {
      const plaintext = "my secret text";
      const password = "pw";
      const ciphertext = await aesEncrypt(plaintext, password);
      const decrypted = await aesDecrypt(ciphertext, password);
      expect(decrypted).toEqual(plaintext);
    });

    it("should not decypt if password is wrong", async () => {
      const plaintext = "my secret text";
      const password = "pw";
      const wrongPassword = "wrong";
      const ciphertext = await aesEncrypt(plaintext, password);
      let decrypted = "";
      try {
        decrypted = await aesDecrypt(ciphertext, wrongPassword);
      } catch (err) {
        expect(err.message).toEqual("Decrypt failed");
      }
      expect(decrypted).not.toEqual(plaintext);
    });

    it("should not decrypt legacy crypto-js ciphertext using aesDecrypt", async () => {
      const plaintext = "my secret text";
      const password = "pw";
      const ciphertext = AES.encrypt(plaintext, password).toString();
      let decrypted = "";
      try {
        decrypted = await aesDecrypt(ciphertext, password);
      } catch (err) {
        expect(err.message).toEqual("Decrypt failed");
      }
      expect(decrypted).not.toEqual(plaintext);
    });
  });

  describe("compat (crypto-js decrypt support)", () => {
    it("should properly decrypt legacy crypto-js ciphertext when using aesDecryptCompat", async () => {
      const plaintext = "my secret text";
      const password = "pw";
      const ciphertext = AES.encrypt(plaintext, password).toString();
      const decrypted = await aesDecryptCompat(ciphertext, password);
      expect(decrypted).toEqual(plaintext);
    });

    it("should not decypt if password is wrong using decrypt legacy crypto-js ciphertext when using aesDecryptCompat", async () => {
      const plaintext = "my secret text";
      const password = "pw";
      const wrongPassword = "wrong";
      const ciphertext = AES.encrypt(plaintext, password).toString();
      let decrypted = "";
      try {
        decrypted = await aesDecryptCompat(ciphertext, wrongPassword);
      } catch (err) {
        expect(err.message).toEqual("Decrypt failed");
      }
      expect(decrypted).not.toEqual(plaintext);
    });
  });
});
