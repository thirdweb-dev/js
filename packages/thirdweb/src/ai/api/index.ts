import type { ThirdwebClient } from "src/client/client.js";

export class NebulaAPI {
  private client: ThirdwebClient;

  constructor(client: ThirdwebClient) {
    this.client = client;
  }

  getClient(): ThirdwebClient {
    return this.client;
  }

  setClient(client: ThirdwebClient): void {
    this.client = client;
  }
}
