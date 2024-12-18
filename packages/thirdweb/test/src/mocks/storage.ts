import { http, HttpResponse } from "msw";
import { getThirdwebDomains } from "../../../src/utils/domains.js";
import type { AsyncStorage } from "../../../src/utils/storage/AsyncStorage.js";

export const handlers = [
  http.post(
    `https://${getThirdwebDomains().storage}/ipfs/upload`,
    async ({ request }) => {
      console.log("MSW handler hit for IPFS upload");
      const formData = await request.formData();
      const files = formData.getAll("file");
      const fileNames = files.map((file: any) => file.name);

      const mockIpfsHash = "QmTest1234567890TestHash";

      if (fileNames.length === 1 && fileNames[0] === "file.txt") {
        return HttpResponse.json({ IpfsHash: mockIpfsHash });
      } else {
        return HttpResponse.json({
          IpfsHash: mockIpfsHash,
          files: fileNames.reduce((acc, fileName) => {
            acc[fileName] = { cid: mockIpfsHash };
            return acc;
          }, {}),
        });
      }
    },
  ),
  http.get("https://*.ipfscdn.io/ipfs/:hash/:id", async (req) => {
    console.log("MSW handler hit for IPFS get");
    return new HttpResponse("IPFS file content", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }),
  http.get("https://arweave.net/:id", async (req) => {
    console.log("MSW handler hit for Arweave get");
    return new HttpResponse("Arweave file content", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }),
];

export class MockStorage implements AsyncStorage {
  private storage: Map<string, string> = new Map();

  getItem(key: string): Promise<string | null> {
    return Promise.resolve(this.storage.get(key) ?? null);
  }
  setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
    return Promise.resolve();
  }
  removeItem(key: string): Promise<void> {
    this.storage.delete(key);
    return Promise.resolve();
  }
}
