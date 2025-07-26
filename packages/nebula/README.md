# Nebula SDK

## Description

The **@thirdweb-dev/nebula** package is a TypeScript SDK for interacting with Nebula, thirdweb's AI agent service for web3 applications. Nebula provides intelligent automation, natural language processing, and AI-powered decision making for blockchain operations, smart contract interactions, and decentralized application management.

### Key Features

- **AI-Powered Smart Contract Analysis**: Automatically analyze and understand smart contract functionality
- **Natural Language Processing**: Convert human language to blockchain operations
- **Intelligent Transaction Optimization**: AI-driven gas optimization and transaction routing
- **Automated Risk Assessment**: AI-based security analysis and risk scoring
- **Multi-Agent Orchestration**: Coordinate multiple AI agents for complex workflows
- **Learning and Adaptation**: Continuously improve through interaction and feedback
- **Integration Ready**: Easy integration with existing thirdweb SDK workflows
- **Type Safety**: Full TypeScript support with auto-generated types

## Installation

```bash
npm install @thirdweb-dev/nebula
```

### Prerequisites

To use the Nebula SDK, you need:

1. **Nebula Service Access**: Access to a thirdweb Nebula instance
2. **API Credentials**: Valid secret key or JWT token
3. **thirdweb Client**: Integration with thirdweb's core SDK

## Usage

### Basic Setup

#### 1. Configure Nebula Client

```typescript
import { configure } from "@thirdweb-dev/nebula";

// Configure once at application startup
configure({
  secretKey: "YOUR_SECRET_KEY",
  baseUrl: "https://nebula-api.thirdweb.com", // Optional: custom endpoint
});
```

#### 2. Alternative Configuration with thirdweb Client

```typescript
import { configureWithClient } from "@thirdweb-dev/nebula";
import { createThirdwebClient } from "thirdweb";

const thirdwebClient = createThirdwebClient({
  secretKey: "YOUR_SECRET_KEY",
});

configureWithClient(thirdwebClient);
```

#### 3. Client-Side Configuration

```typescript
import { getNebulaClient } from "@thirdweb-dev/nebula";

// For client applications (e.g., NextJS frontend)
const nebulaClient = getNebulaClient("your-auth-token");
```

### AI Models and Agents

#### List Available Models

```typescript
import { getModels } from "@thirdweb-dev/nebula";

const models = await getModels();
console.log("Available AI models:", models.data);

// Example response:
// {
//   models: [
//     {
//       id: "nebula-contract-analyzer-v1",
//       name: "Contract Analyzer",
//       description: "Analyzes smart contracts for functionality and security",
//       capabilities: ["analysis", "security", "optimization"]
//     },
//     {
//       id: "nebula-transaction-optimizer-v1", 
//       name: "Transaction Optimizer",
//       description: "Optimizes transaction parameters for cost and speed",
//       capabilities: ["optimization", "gas-estimation"]
//     }
//   ]
// }
```

#### Get Available Agents

```typescript
import { getAgents } from "@thirdweb-dev/nebula";

// Server-side usage
const agents = await getAgents();

// Client-side usage
const agentsResult = await getAgents({ client: nebulaClient });

console.log("Available agents:", agentsResult.data);
```

### Smart Contract Analysis

#### Analyze Contract Functionality

```typescript
import { analyzeContract } from "@thirdweb-dev/nebula";

const analysis = await analyzeContract({
  body: {
    contractAddress: "0x1234567890123456789012345678901234567890",
    chainId: 1, // Ethereum mainnet
    analysisType: "comprehensive", // or "security", "gas", "functionality"
    includeSourceCode: true,
  },
});

console.log("Contract analysis:", analysis.data);

// Example response:
// {
//   contractType: "ERC721",
//   functions: [
//     {
//       name: "mint",
//       type: "payable",
//       description: "Mints new NFT tokens to specified address",
//       riskLevel: "low",
//       gasEstimate: "85000"
//     }
//   ],
//   securityScore: 85,
//   recommendations: [
//     "Consider implementing access controls for mint function",
//     "Add reentrancy guards for external calls"
//   ]
// }
```

#### Get Security Assessment

```typescript
import { assessContractSecurity } from "@thirdweb-dev/nebula";

const securityAssessment = await assessContractSecurity({
  body: {
    contractAddress: "0x...",
    chainId: 1,
    includeVulnerabilities: true,
    checkCompliance: ["erc721", "eip165"],
  },
});

console.log("Security assessment:", securityAssessment.data);
```

### Natural Language Processing

#### Convert Natural Language to Blockchain Operations

```typescript
import { parseIntent } from "@thirdweb-dev/nebula";

const intent = await parseIntent({
  body: {
    query: "Send 0.5 ETH to alice.eth and mint an NFT for bob.eth",
    context: {
      userAddress: "0x...",
      availableContracts: ["0x..."], // User's deployed contracts
      chainId: 1,
    },
  },
});

console.log("Parsed intent:", intent.data);

// Example response:
// {
//   operations: [
//     {
//       type: "transfer",
//       to: "0x...", // alice.eth resolved address
//       amount: "500000000000000000", // 0.5 ETH in wei
//       confidence: 0.95
//     },
//     {
//       type: "contract_call",
//       contractAddress: "0x...",
//       functionName: "mint",
//       parameters: ["0x..."], // bob.eth resolved address
//       confidence: 0.88
//     }
//   ],
//   estimatedGas: "150000",
//   totalCost: "0.003 ETH"
// }
```

#### Generate Smart Contract Code

```typescript
import { generateContract } from "@thirdweb-dev/nebula";

const generatedContract = await generateContract({
  body: {
    description: "Create an ERC721 NFT contract with marketplace functionality and royalties",
    features: [
      "mintable",
      "burnable", 
      "royalties",
      "marketplace-integration"
    ],
    standards: ["erc721", "erc2981"], // Royalty standard
    accessControl: "ownable",
  },
});

console.log("Generated contract:", generatedContract.data.sourceCode);
```

### Transaction Optimization

#### Optimize Transaction Parameters

```typescript
import { optimizeTransaction } from "@thirdweb-dev/nebula";

const optimization = await optimizeTransaction({
  body: {
    transaction: {
      to: "0x...",
      data: "0x...", // Contract call data
      value: "0",
    },
    chainId: 1,
    priority: "cost", // or "speed", "balanced"
    userPreferences: {
      maxGasPrice: "50000000000", // 50 gwei
      maxWaitTime: 300, // 5 minutes
    },
  },
});

console.log("Optimized transaction:", optimization.data);

// Example response:
// {
//   optimizedParams: {
//     gasLimit: "85000",
//     gasPrice: "25000000000", // 25 gwei
//     maxFeePerGas: "30000000000",
//     maxPriorityFeePerGas: "2000000000"
//   },
//   estimatedTime: "180", // 3 minutes
//   estimatedCost: "0.002125 ETH",
//   confidence: 0.92,
//   reasoning: "Current network congestion is low, allowing for lower gas prices"
// }
```

#### Batch Transaction Analysis

```typescript
import { analyzeBatchTransactions } from "@thirdweb-dev/nebula";

const batchAnalysis = await analyzeBatchTransactions({
  body: {
    transactions: [
      {
        to: "0x...",
        data: "0x...",
        value: "1000000000000000000", // 1 ETH
      },
      {
        to: "0x...",
        data: "0x...",
        value: "0",
      },
    ],
    optimizationGoals: ["minimize-cost", "atomic-execution"],
    chainId: 1,
  },
});
```

### AI Agent Workflows

#### Create Custom AI Agent

```typescript
import { createAgent } from "@thirdweb-dev/nebula";

const customAgent = await createAgent({
  body: {
    name: "DeFi Portfolio Manager",
    description: "Automated DeFi portfolio management and optimization",
    capabilities: [
      "portfolio-analysis",
      "yield-optimization",
      "risk-management",
      "rebalancing"
    ],
    model: "nebula-defi-agent-v1",
    configuration: {
      riskTolerance: "moderate",
      rebalanceThreshold: 0.05, // 5% deviation triggers rebalance
      maxSlippage: 0.01, // 1% max slippage
    },
    automationRules: [
      {
        trigger: "weekly",
        action: "portfolio-review",
        conditions: ["market-stable"]
      }
    ],
  },
});

console.log("Created agent:", customAgent.data.agentId);
```

#### Execute Agent Workflow

```typescript
import { executeAgentWorkflow } from "@thirdweb-dev/nebula";

const workflowResult = await executeAgentWorkflow({
  body: {
    agentId: "agent-123",
    workflow: "portfolio-optimization",
    inputs: {
      walletAddress: "0x...",
      targetAllocation: {
        "ETH": 0.4,
        "USDC": 0.3,
        "WBTC": 0.2,
        "Other": 0.1
      },
      maxGasPrice: "30000000000" // 30 gwei
    },
    executionMode: "simulation", // or "live"
  },
});

console.log("Workflow result:", workflowResult.data);
```

### Real-time AI Assistance

#### Start AI Chat Session

```typescript
import { startChatSession, sendChatMessage } from "@thirdweb-dev/nebula";

// Start a chat session with AI assistant
const session = await startChatSession({
  body: {
    context: {
      userAddress: "0x...",
      connectedChains: [1, 137, 42161], // Ethereum, Polygon, Arbitrum
      availableTokens: ["ETH", "USDC", "MATIC"],
    },
    personality: "helpful-expert", // or "casual", "technical"
    capabilities: ["transaction-help", "contract-analysis", "market-insights"],
  },
});

// Send messages to the AI assistant
const response = await sendChatMessage({
  body: {
    sessionId: session.data.sessionId,
    message: "I want to swap 100 USDC for ETH on Polygon. What's the best way to do this?",
    includeTransactionPlan: true,
  },
});

console.log("AI Response:", response.data.message);
console.log("Suggested transactions:", response.data.transactionPlan);
```

### Advanced Features

#### Multi-Agent Coordination

```typescript
import { orchestrateAgents } from "@thirdweb-dev/nebula";

const orchestration = await orchestrateAgents({
  body: {
    task: "cross-chain-arbitrage",
    agents: [
      {
        id: "price-monitor-agent",
        role: "market-surveillance",
        chains: [1, 137, 42161]
      },
      {
        id: "transaction-executor-agent", 
        role: "execution",
        chains: [1, 137, 42161]
      },
      {
        id: "risk-manager-agent",
        role: "risk-assessment"
      }
    ],
    coordinationRules: {
      consensusRequired: true,
      riskThreshold: 0.02, // 2% max risk
      profitThreshold: 0.005, // 0.5% min profit
    },
  },
});
```

#### Learning and Feedback

```typescript
import { provideFeedback } from "@thirdweb-dev/nebula";

await provideFeedback({
  body: {
    sessionId: "session-123",
    interactionId: "interaction-456",
    feedback: {
      rating: 5, // 1-5 stars
      success: true,
      comments: "The AI correctly identified the optimal gas settings",
      improvementSuggestions: ["Could provide more detailed risk analysis"],
    },
  },
});
```

## Configuration Options

### Client Configuration

```typescript
import { configure } from "@thirdweb-dev/nebula";

configure({
  secretKey: "your-secret-key",
  baseUrl: "https://nebula-api.thirdweb.com",
  
  // Optional configuration
  timeout: 30000, // Request timeout in ms
  retries: 3, // Number of retries for failed requests
  
  // AI model preferences
  defaultModel: "nebula-general-v1",
  temperature: 0.7, // Creativity vs accuracy (0-1)
  maxTokens: 2048, // Max response length
  
  // Rate limiting
  rateLimit: {
    requestsPerMinute: 60,
    burstLimit: 10,
  },
});
```

### Agent Configuration

```typescript
const agentConfig = {
  model: "nebula-specialized-v1", 
  personality: {
    tone: "professional", // casual, professional, technical
    verbosity: "concise", // brief, concise, detailed
    riskAversion: "moderate", // low, moderate, high
  },
  capabilities: {
    contractAnalysis: true,
    transactionOptimization: true,
    marketInsights: true,
    crossChainOperations: true,
  },
  constraints: {
    maxGasPrice: "50000000000", // 50 gwei
    maxTransactionValue: "10000000000000000000", // 10 ETH
    allowedChains: [1, 137, 42161],
    requireConfirmation: true,
  },
};
```

## API Reference

### Core Functions

- `configure(options)` - Configure the Nebula client
- `configureWithClient(client)` - Configure with thirdweb client
- `getNebulaClient(token)` - Get client instance for frontend use
- `getModels()` - List available AI models
- `getAgents(options?)` - List available agents

### Analysis Functions

- `analyzeContract(options)` - Analyze smart contract functionality
- `assessContractSecurity(options)` - Security assessment of contracts
- `analyzeBatchTransactions(options)` - Analyze multiple transactions
- `optimizeTransaction(options)` - Optimize transaction parameters

### NLP Functions

- `parseIntent(options)` - Convert natural language to blockchain operations
- `generateContract(options)` - Generate smart contract code from description
- `explainTransaction(options)` - Explain transaction in human language

### Agent Functions

- `createAgent(options)` - Create custom AI agent
- `executeAgentWorkflow(options)` - Execute agent workflow
- `orchestrateAgents(options)` - Coordinate multiple agents

### Chat Functions

- `startChatSession(options)` - Start AI chat session
- `sendChatMessage(options)` - Send message to AI assistant
- `getChatHistory(sessionId)` - Retrieve chat history

## Examples

### AI-Powered DeFi Assistant

```typescript
import { 
  startChatSession, 
  sendChatMessage, 
  executeAgentWorkflow 
} from "@thirdweb-dev/nebula";

class DeFiAIAssistant {
  private sessionId: string;

  async initialize(userContext: any) {
    const session = await startChatSession({
      body: {
        context: userContext,
        personality: "helpful-expert",
        capabilities: [
          "defi-strategies",
          "yield-optimization", 
          "risk-analysis",
          "transaction-planning"
        ],
      },
    });
    
    this.sessionId = session.data.sessionId;
    return session;
  }

  async getYieldOptimizationAdvice(portfolioData: any) {
    const response = await sendChatMessage({
      body: {
        sessionId: this.sessionId,
        message: `Analyze my DeFi portfolio and suggest yield optimization strategies: ${JSON.stringify(portfolioData)}`,
        includeTransactionPlan: true,
        includeRiskAssessment: true,
      },
    });

    return {
      advice: response.data.message,
      suggestedTransactions: response.data.transactionPlan,
      riskAssessment: response.data.riskAssessment,
    };
  }

  async executeOptimization(strategy: string) {
    return await executeAgentWorkflow({
      body: {
        agentId: "defi-optimizer-agent",
        workflow: "yield-optimization",
        inputs: {
          strategy,
          sessionId: this.sessionId,
        },
        executionMode: "simulation", // Simulate first
      },
    });
  }
}

// Usage
const assistant = new DeFiAIAssistant();
await assistant.initialize({
  userAddress: "0x...",
  connectedChains: [1, 137],
  currentPositions: {
    "USDC": "10000",
    "ETH": "5",
    "MATIC": "1000"
  }
});

const advice = await assistant.getYieldOptimizationAdvice({
  totalValue: "$50000",
  riskTolerance: "moderate",
  timeHorizon: "6-months"
});
```

### Smart Contract Security Auditor

```typescript
import { 
  analyzeContract, 
  assessContractSecurity, 
  generateContract 
} from "@thirdweb-dev/nebula";

class AISecurityAuditor {
  async auditContract(contractAddress: string, chainId: number) {
    // Get comprehensive analysis
    const analysis = await analyzeContract({
      body: {
        contractAddress,
        chainId,
        analysisType: "comprehensive",
        includeSourceCode: true,
      },
    });

    // Get detailed security assessment
    const security = await assessContractSecurity({
      body: {
        contractAddress,
        chainId,
        includeVulnerabilities: true,
        checkCompliance: ["erc20", "erc721", "erc1155"],
      },
    });

    return {
      analysis: analysis.data,
      security: security.data,
      overallRisk: this.calculateOverallRisk(analysis.data, security.data),
      recommendations: this.generateRecommendations(analysis.data, security.data),
    };
  }

  async generateSecureContract(requirements: any) {
    const generatedContract = await generateContract({
      body: {
        description: requirements.description,
        features: requirements.features,
        standards: requirements.standards,
        accessControl: "role-based",
        includeSecurityFeatures: [
          "reentrancy-guard",
          "pause-mechanism",
          "access-control",
          "overflow-protection"
        ],
      },
    });

    // Auto-audit the generated contract
    const auditResult = await this.auditGeneratedContract(
      generatedContract.data.sourceCode
    );

    return {
      sourceCode: generatedContract.data.sourceCode,
      securityScore: auditResult.securityScore,
      potentialIssues: auditResult.issues,
      deploymentGuidance: generatedContract.data.deploymentInstructions,
    };
  }

  private calculateOverallRisk(analysis: any, security: any): string {
    // Custom risk calculation logic
    const riskScore = (100 - security.securityScore) * 0.7 + 
                     analysis.complexityScore * 0.3;
    
    if (riskScore < 20) return "low";
    if (riskScore < 50) return "medium";
    return "high";
  }

  private generateRecommendations(analysis: any, security: any): string[] {
    // Generate contextual recommendations based on analysis
    const recommendations = [...security.recommendations];
    
    if (analysis.contractType === "ERC721" && !analysis.hasRoyalties) {
      recommendations.push("Consider implementing ERC2981 royalty standard");
    }
    
    return recommendations;
  }

  private async auditGeneratedContract(sourceCode: string) {
    // Implementation for auditing generated contracts
    return {
      securityScore: 95,
      issues: [],
    };
  }
}
```

## References

### Documentation
- [Nebula Documentation](https://portal.thirdweb.com/nebula) - Complete Nebula guide
- [AI Agent Development](https://portal.thirdweb.com/nebula/agents) - Creating custom agents
- [Natural Language Processing](https://portal.thirdweb.com/nebula/nlp) - NLP capabilities and usage

### AI Models and Capabilities
- [Available Models](https://portal.thirdweb.com/nebula/models) - List of AI models and their capabilities
- [Model Training](https://portal.thirdweb.com/nebula/training) - Custom model training and fine-tuning
- [Performance Metrics](https://portal.thirdweb.com/nebula/metrics) - Model performance and accuracy metrics

### Integration Examples
- [Nebula Examples](https://github.com/thirdweb-example/nebula-examples) - Example implementations
- [AI DeFi Assistant](https://github.com/thirdweb-example/nebula-defi) - DeFi-focused AI assistant
- [Smart Contract Auditor](https://github.com/thirdweb-example/nebula-auditor) - AI-powered security auditing

### Advanced Topics
- [Multi-Agent Systems](https://portal.thirdweb.com/nebula/multi-agent) - Coordinating multiple AI agents
- [Custom Workflows](https://portal.thirdweb.com/nebula/workflows) - Building custom AI workflows
- [Learning and Adaptation](https://portal.thirdweb.com/nebula/learning) - How Nebula learns and improves

### API References
- [Nebula API Reference](https://nebula-api.thirdweb.com/docs) - Complete API documentation
- [WebSocket Events](https://portal.thirdweb.com/nebula/websockets) - Real-time communication
- [Rate Limits](https://portal.thirdweb.com/nebula/rate-limits) - Usage limits and optimization

### Community and Support
- [Discord #nebula](https://discord.gg/thirdweb) - Nebula specific help and discussions
- [AI Research Papers](https://research.thirdweb.com/nebula) - Academic research and publications
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report Nebula SDK issues
