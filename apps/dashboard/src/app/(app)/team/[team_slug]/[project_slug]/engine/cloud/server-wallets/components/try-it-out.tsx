"use client";
import { Button } from "@/components/ui/button";
import { CodeClient } from "@/components/ui/code/code.client";
import { TabButtons } from "@/components/ui/tabs";
import { THIRDWEB_ENGINE_CLOUD_URL } from "@/constants/env";
import Link from "next/link";
import { useState } from "react";
import type { Wallet } from "../wallet-table/types";

export function TryItOut(props: {
  authToken: string;
  wallet?: Wallet;
  team_slug: string;
  project_slug: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("sdk");

  return (
    <div className="flex flex-col gap-6 overflow-hidden rounded-lg border border-border bg-card p-6">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-1 flex-col gap-4 rounded-lg rounded-b-none lg:flex-row lg:justify-between">
          <div>
            <h2 className="font-semibold text-xl tracking-tight">
              Usage from your backend
            </h2>
            <p className="text-muted-foreground text-sm">
              Send transactions from your server wallets using a simple http API
            </p>
          </div>
        </div>
      </div>
      <div>
        <TabButtons
          tabs={[
            {
              name: "SDK",
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

        <div className="h-4" />

        {activeTab === "sdk" && (
          <CodeClient lang="ts" code={sdkExample()} className="bg-background" />
        )}
        {activeTab === "curl" && (
          <CodeClient
            lang="bash"
            code={curlExample()}
            className="bg-background"
          />
        )}
        {activeTab === "js" && (
          <CodeClient lang="js" code={jsExample()} className="bg-background" />
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

        <div className="h-4" />
        <div className="flex flex-row justify-end gap-4">
          <Button variant={"secondary"} asChild>
            <Link
              href={`/team/${props.team_slug}/${props.project_slug}/engine/cloud/explorer`}
              rel="noreferrer"
            >
              View API reference
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

const sdkExample = () => `\
import { Engine, createThirdwebClient, sendTransaction } from "thirdweb";
import { claimTo } from "thirdweb/extensions/erc1155";

const client = createThirdwebClient({
  secretKey: "<your-project-secret-key>",
});

// Create a server wallet
const serverWallet = Engine.serverWallet({  
  client,
  walletAddress: "<your-server-wallet-address>",
  vaultAccessToken: "<your-vault-access-token>",
});

// Prepare a transaction
const transaction = claimTo({
  contract,
  to: "0x...",
  tokenId: 0n,
  quantity: 1n,
});

// Send the transaction
const result = await sendTransaction({
  account: serverWallet,
  transaction,
});
console.log("Transaction hash:", result.transactionHash);
`;

const curlExample = () => `\
curl -X POST "${THIRDWEB_ENGINE_CLOUD_URL}/v1/write/contract" \\
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
  "${THIRDWEB_ENGINE_CLOUD_URL}/v1/write/contract",
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

url = "${THIRDWEB_ENGINE_CLOUD_URL}/v1/write/contract"
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
	url := "${THIRDWEB_ENGINE_CLOUD_URL}/v1/write/contract"
	
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
        var url = "${THIRDWEB_ENGINE_CLOUD_URL}/v1/write/contract";
        
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
