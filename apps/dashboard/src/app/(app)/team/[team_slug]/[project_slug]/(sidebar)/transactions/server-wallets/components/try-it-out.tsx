"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeClient } from "@/components/ui/code/code.client";
import { TabButtons } from "@/components/ui/tabs";
import { NEXT_PUBLIC_ENGINE_CLOUD_URL } from "@/constants/public-envs";
import { CircleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TryItOut() {
  const [activeTab, setActiveTab] = useState<string>("sdk");

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-lg border border-border bg-card p-4">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none lg:flex-row lg:justify-between">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Usage from your backend
            </h2>
            <p className="text-muted-foreground text-sm">
              Send transactions from your server wallets using the thirdweb SDK
              or the HTTP API directly.
            </p>
          </div>
        </div>
      </div>

      <div>
        <TabButtons
          tabClassName="!text-sm"
          tabs={[
            {
              name: "thirdweb SDK",
              onClick: () => setActiveTab("sdk"),
              isActive: activeTab === "sdk",
            },
            {
              name: "Curl",
              onClick: () => setActiveTab("curl"),
              isActive: activeTab === "curl",
            },
            {
              name: "JavaScript",
              onClick: () => setActiveTab("js"),
              isActive: activeTab === "js",
            },
            {
              name: "Python",
              onClick: () => setActiveTab("python"),
              isActive: activeTab === "python",
            },
            {
              name: "Go",
              onClick: () => setActiveTab("go"),
              isActive: activeTab === "go",
            },
            {
              name: "C#",
              onClick: () => setActiveTab("csharp"),
              isActive: activeTab === "csharp",
            },
          ]}
        />

        <div className="h-2" />

        {activeTab === "sdk" && (
          <div className="flex flex-col gap-6">
            <Alert variant="info" className="bg-background">
              <CircleAlertIcon className="size-5" />
              <AlertTitle>Using the thirdweb SDK on the backend</AlertTitle>
              <AlertDescription className="leading-loose">
                <p className="text-foreground text-sm">
                  You can use the full TypeScript thirdweb SDK in your backend,
                  allowing you to use:{" "}
                  <ul className="ml-2 list-disc py-2 pl-4">
                    <li>
                      The full catalog of{" "}
                      <Link
                        href="https://portal.thirdweb.com/references/typescript/v5/functions#extensions"
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        extension functions
                      </Link>
                    </li>
                    <li>
                      The{" "}
                      <Link
                        href="https://portal.thirdweb.com/references/typescript/v5/prepareContractCall"
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        prepareContractCall
                      </Link>{" "}
                      function to encode your transactions
                    </li>
                    <li>
                      The full{" "}
                      <Link
                        href="https://portal.thirdweb.com/references/typescript/v5/Account"
                        className="text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        account
                      </Link>{" "}
                      interface, predefined chains, and more
                    </li>
                  </ul>
                  The SDK handles encoding your transactions, signing them to
                  Engine and polling for status.
                </p>
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg tracking-tight">
                Installation
              </h3>
              <CodeClient
                lang="shell"
                code={"npm install thirdweb"}
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg tracking-tight">
                Usage example: Minting a ERC1155 NFT to a user
              </h3>
              <CodeClient
                lang="ts"
                code={sdkExample()}
                className="bg-background"
              />
            </div>
          </div>
        )}
        {activeTab === "curl" && (
          <CodeClient
            lang="bash"
            code={curlExample()}
            className="bg-background"
          />
        )}
        {activeTab === "js" && (
          <div className="flex flex-col gap-4 pt-2">
            <p className="text-muted-foreground text-sm">
              A lightweight, type safe wrapper package of the Engine HTTP API is
              available on{" "}
              <Link
                href="https://www.npmjs.com/package/@thirdweb-dev/engine"
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                NPM
              </Link>
              .
            </p>
            <CodeClient
              lang="js"
              code={jsExample()}
              className="bg-background"
            />
          </div>
        )}
        {activeTab === "python" && (
          <CodeClient
            lang="python"
            code={pythonExample()}
            className="bg-background"
          />
        )}
        {activeTab === "go" && (
          <CodeClient lang="go" code={goExample()} className="bg-background" />
        )}
        {activeTab === "csharp" && (
          <CodeClient
            lang="csharp"
            code={csharpExample()}
            className="bg-background"
          />
        )}
      </div>
    </div>
  );
}

const sdkExample = () => `\
import { createThirdwebClient, sendTransaction, getContract, Engine } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";

// Create a thirdweb client
const client = createThirdwebClient({
  secretKey: "<your-project-secret-key>",
});

// Create a server wallet
const serverWallet = Engine.serverWallet({
  client,
  address: "<your-server-wallet-address>",
  vaultAccessToken: "<your-vault-access-token>",
});

// Prepare the transaction
const transaction = claimTo({
  contract: getContract({
    client,
    address: "0x...", // Address of the ERC1155 token contract
    chain: baseSepolia, // Chain of the ERC1155 token contract
  }),
  to: "0x...", // The address of the user to mint to
  tokenId: 0n, // The token ID of the NFT to mint
  quantity: 1n, // The quantity of NFTs to mint
});

// Enqueue the transaction via Engine
const { transactionId } = await serverWallet.enqueueTransaction({
  transaction,
});

// Get the execution status of the transaction at any point in time
const executionResult = await Engine.getTransactionStatus({
  client,
  transactionId,
});

// Utility function to poll for the transaction to be submitted onchain
const txHash = await Engine.waitForTransactionHash({
  client,
  transactionId,
});
console.log("Transaction hash:", txHash);
`;

const curlExample = () => `\
curl -X POST "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract" \\
  -H "Content-Type: application/json" \\
  -H "x-secret-key: <your-project-secret-key>" \\
  -H "x-vault-access-token: <your-vault-access-token>" \\
  -d '{
    "executionOptions": {
      "from": "<your-server-wallet-address>",
      "chainId": "84532"
    },
    "params": [
      {
        "contractAddress": "0x...",
        "method": "function mintTo(address to, uint256 amount)",
        "params": ["0x...", "100"]
      }
    ]
  }'`;

const jsExample = () => `\
const response = await fetch(
  "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": "<your-project-secret-key>",
      "x-vault-access-token": "<your-vault-access-token>"
    },
    body: JSON.stringify({
      "executionOptions": {
        "from": "<your-server-wallet-address>",
        "chainId": "84532"
      },
      "params": [
        {
          "contractAddress": "0x...",
          "method": "function mintTo(address to, uint256 amount)",
          "params": ["0x...", "100"]
        }
      ]
    })
  }
);`;

const pythonExample = () => `\
import requests
import json

url = "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract"
headers = {
    "Content-Type": "application/json",
    "x-secret-key": "<your-project-secret-key>",
    "x-vault-access-token": "<your-vault-access-token>"
}
payload = {
    "executionOptions": {
        "from": "<your-server-wallet-address>",
        "chainId": "84532"
    },
    "params": [
        {
            "contractAddress": "0x...",
            "method": "function mintTo(address to, uint256 amount)",
            "params": ["0x...", "100"]
        }
    ]
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()`;

const goExample = () => `\
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract"

	// Create the request payload
	type Param struct {
		ContractAddress string   \`json:"contractAddress"\`
		Method          string   \`json:"method"\`
		Params          []string \`json:"params"\`
	}

	type RequestBody struct {
		ExecutionOptions struct {
			From    string \`json:"from"\`
			ChainId string \`json:"chainId"\`
		} \`json:"executionOptions"\`
		Params []Param \`json:"params"\`
	}

	requestBody := RequestBody{
		Params: []Param{
			{
				ContractAddress: "0x...",
				Method:          "function mintTo(address to, uint256 amount)",
				Params:          []string{"0x...", "100"},
			},
		},
	}
	requestBody.ExecutionOptions.From = "<your-server-wallet-address>"
	requestBody.ExecutionOptions.ChainId = "84532"

	jsonData, _ := json.Marshal(requestBody)

	// Create the HTTP request
	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-secret-key", "<your-project-secret-key>")
	req.Header.Set("x-vault-access-token", "<your-vault-access-token>")

	// Send the request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	// Process the response
	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Println("Response:", result)
}`;

const csharpExample = () => `\
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var url = "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract";

        var requestData = new
        {
            executionOptions = new
            {
                from = "<your-server-wallet-address>",
                chainId = "84532"
            },
            @params = new[]
            {
                new
                {
                    contractAddress = "0x...",
                    method = "function mintTo(address to, uint256 amount)",
                    @params = new[] { "0x...", "100" }
                }
            }
        };

        var json = JsonSerializer.Serialize(requestData);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var httpClient = new HttpClient();
        httpClient.DefaultRequestHeaders.Add("x-secret-key", "<your-project-secret-key>");
        httpClient.DefaultRequestHeaders.Add("x-vault-access-token", "<your-vault-access-token>");

        var response = await httpClient.PostAsync(url, content);
        var responseContent = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseContent);
    }
}`;
