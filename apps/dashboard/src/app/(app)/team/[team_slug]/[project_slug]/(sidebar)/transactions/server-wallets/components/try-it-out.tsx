"use client";
import Link from "next/link";
import { useState } from "react";
import { CodeClient } from "@/components/ui/code/code.client";
import { TabButtons } from "@/components/ui/tabs";
import {
  NEXT_PUBLIC_ENGINE_CLOUD_URL,
  NEXT_PUBLIC_THIRDWEB_API_HOST,
} from "@/constants/public-envs";

interface TryItOutProps {
  useEngineAPI: boolean;
}

export function TryItOut({ useEngineAPI }: TryItOutProps) {
  const [activeTab, setActiveTab] = useState<string>("curl");

  const apiTitle = useEngineAPI
    ? "Engine API (advanced)"
    : "thirdweb API (recommended)";
  const apiDescription = useEngineAPI
    ? "Send transactions from your server wallets using the thirdweb SDK or the Engine HTTP API directly.."
    : "Send transactions from your server wallets using the thirdweb SDK or the thirdweb HTTP API directly.";

  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none lg:flex-row lg:justify-between pb-2">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Usage from your backend - {apiTitle}
            </h2>
            <p className="text-muted-foreground text-sm">{apiDescription}</p>
          </div>
        </div>
      </div>

      <div>
        <TabButtons
          tabs={[
            {
              isActive: activeTab === "curl",
              name: "Curl",
              onClick: () => setActiveTab("curl"),
            },
            {
              isActive: activeTab === "sdk",
              name: "thirdweb SDK",
              onClick: () => setActiveTab("sdk"),
            },
            {
              isActive: activeTab === "js",
              name: "JavaScript",
              onClick: () => setActiveTab("js"),
            },
            {
              isActive: activeTab === "python",
              name: "Python",
              onClick: () => setActiveTab("python"),
            },
            {
              isActive: activeTab === "go",
              name: "Go",
              onClick: () => setActiveTab("go"),
            },
            {
              isActive: activeTab === "csharp",
              name: "C#",
              onClick: () => setActiveTab("csharp"),
            },
          ]}
        />

        <div className="h-4" />

        {activeTab === "sdk" && (
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg tracking-tight">
                Installation
              </h3>
              <CodeClient
                className="bg-background"
                code={"npm install thirdweb"}
                lang="shell"
              />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg tracking-tight">
                Usage example: Minting a ERC1155 NFT to a user
              </h3>
              <CodeClient
                className="bg-background"
                code={sdkExample()}
                lang="ts"
              />
            </div>
          </div>
        )}
        {activeTab === "curl" && (
          <CodeClient
            className="bg-background"
            code={useEngineAPI ? engineCurlExample() : thirdwebCurlExample()}
            lang="bash"
          />
        )}
        {activeTab === "js" && (
          <div className="flex flex-col gap-4 pt-2">
            {useEngineAPI && (
              <p className="text-muted-foreground text-sm">
                A lightweight, type safe wrapper package of the Engine HTTP API
                is available on{" "}
                <Link
                  className="text-blue-500"
                  href="https://www.npmjs.com/package/@thirdweb-dev/engine"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  NPM
                </Link>
                .
              </p>
            )}
            <CodeClient
              className="bg-background"
              code={useEngineAPI ? engineJsExample() : thirdwebJsExample()}
              lang="js"
            />
          </div>
        )}
        {activeTab === "python" && (
          <CodeClient
            className="bg-background"
            code={
              useEngineAPI ? enginePythonExample() : thirdwebPythonExample()
            }
            lang="python"
          />
        )}
        {activeTab === "go" && (
          <CodeClient
            className="bg-background"
            code={useEngineAPI ? engineGoExample() : thirdwebGoExample()}
            lang="go"
          />
        )}
        {activeTab === "csharp" && (
          <CodeClient
            className="bg-background"
            code={
              useEngineAPI ? engineCsharpExample() : thirdwebCsharpExample()
            }
            lang="csharp"
          />
        )}
      </div>
    </>
  );
}

// thirdweb API examples
const thirdwebCurlExample = () => `\
curl -X POST "${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/transactions" \\
  -H "Content-Type: application/json" \\
  -H "x-secret-key: <your-project-secret-key>" \\
  -d '{
    "chainId": "84532",
    "from": "<your-server-wallet-address>",
    "transactions": [
      {
        "type": "contractCall",
        "contractAddress": "0x...",
        "method": "function mintTo(address to, uint256 amount)",
        "params": ["0x...", "100"]
      }
    ]
  }'`;

const thirdwebJsExample = () => `\
const response = await fetch(
  "${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/transactions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": "<your-project-secret-key>",
    },
    body: JSON.stringify({
      "chainId": "84532",
      "from": "<your-server-wallet-address>",
      "transactions": [
        {
          "type": "contractCall",
          "contractAddress": "0x...",
          "method": "function mintTo(address to, uint256 amount)",
          "params": ["0x...", "100"]
        }
      ]
    })
  }
);`;

const thirdwebPythonExample = () => `\
import requests
import json

url = "${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/transactions"
headers = {
    "Content-Type": "application/json",
    "x-secret-key": "<your-project-secret-key>",
}
payload = {
    "chainId": "84532",
    "from": "<your-server-wallet-address>",
    "transactions": [
        {
            "type": "contractCall",
            "contractAddress": "0x...",
            "method": "function mintTo(address to, uint256 amount)",
            "params": ["0x...", "100"]
        }
    ]
}

response = requests.post(url, headers=headers, json=payload)
result = response.json()`;

const thirdwebGoExample = () => `\
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/transactions"

	type Transaction struct {
		Type            string   \`json:"type"\`
		ContractAddress string   \`json:"contractAddress"\`
		Method          string   \`json:"method"\`
		Params          []string \`json:"params"\`
	}

	type RequestBody struct {
		ChainId      string        \`json:"chainId"\`
		From         string        \`json:"from"\`
		Transactions []Transaction \`json:"transactions"\`
	}

	requestBody := RequestBody{
		ChainId: "84532",
		From:    "<your-server-wallet-address>",
		Transactions: []Transaction{
			{
				Type:            "contractCall",
				ContractAddress: "0x...",
				Method:          "function mintTo(address to, uint256 amount)",
				Params:          []string{"0x...", "100"},
			},
		},
	}

	jsonData, _ := json.Marshal(requestBody)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-secret-key", "<your-project-secret-key>")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Println("Response:", result)
}`;

const thirdwebCsharpExample = () => `\
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        var url = "${NEXT_PUBLIC_THIRDWEB_API_HOST}/v1/transactions";

        var requestData = new
        {
            chainId = "84532",
            from = "<your-server-wallet-address>",
            transactions = new[]
            {
                new
                {
                    type = "contractCall",
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

        var response = await httpClient.PostAsync(url, content);
        var responseContent = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseContent);
    }
}`;

// Engine API examples (original examples)
const engineCurlExample = () => `\
curl -X POST "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract" \\
  -H "Content-Type: application/json" \\
  -H "x-secret-key: <your-project-secret-key>" \\
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

const engineJsExample = () => `\
const response = await fetch(
  "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": "<your-project-secret-key>",
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

const enginePythonExample = () => `\
import requests
import json

url = "${NEXT_PUBLIC_ENGINE_CLOUD_URL}/v1/write/contract"
headers = {
    "Content-Type": "application/json",
    "x-secret-key": "<your-project-secret-key>",
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

const engineGoExample = () => `\
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

const engineCsharpExample = () => `\
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

        var response = await httpClient.PostAsync(url, content);
        var responseContent = await response.Content.ReadAsStringAsync();

        Console.WriteLine(responseContent);
    }
}`;

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
