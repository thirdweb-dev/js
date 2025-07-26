# Service Utils

## Description

The **@thirdweb-dev/service-utils** package provides a comprehensive collection of utilities, types, and helper functions used across thirdweb's backend services and infrastructure. This package contains shared functionality for authentication, data validation, error handling, logging, caching, and other common service operations used internally by thirdweb services.

### Key Features

- **Authentication Utilities**: JWT token handling, signature verification, and session management
- **Data Validation**: Zod schemas and validation utilities for API inputs and outputs
- **Error Handling**: Standardized error types and error handling utilities
- **Logging**: Structured logging utilities with multiple output formats
- **Caching**: Redis and in-memory caching utilities with TTL support
- **Database Utilities**: Database connection helpers and query utilities
- **Queue Management**: Job queue utilities with retry mechanisms
- **Cryptographic Functions**: Secure hashing, encryption, and signing utilities
- **Rate Limiting**: Request rate limiting and throttling utilities
- **Configuration Management**: Environment-based configuration loading

## Installation

```bash
npm install @thirdweb-dev/service-utils
```

### Platform-Specific Exports

The package provides different exports for different environments:

```bash
# For general Node.js environments
import { ... } from "@thirdweb-dev/service-utils"

# For Cloudflare Workers
import { ... } from "@thirdweb-dev/service-utils/cf-worker"

# For Node.js specific features
import { ... } from "@thirdweb-dev/service-utils/node"
```

## Usage

### Authentication Utilities

#### JWT Token Management

```typescript
import { 
  generateJWT, 
  verifyJWT, 
  refreshJWT, 
  JWTPayload 
} from "@thirdweb-dev/service-utils";

// Generate JWT token
const payload: JWTPayload = {
  userId: "user123",
  walletAddress: "0x...",
  permissions: ["read", "write"],
  exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
};

const token = await generateJWT(payload, "your-secret-key");
console.log("Generated token:", token);

// Verify JWT token
try {
  const decoded = await verifyJWT(token, "your-secret-key");
  console.log("Decoded payload:", decoded);
} catch (error) {
  console.error("Invalid token:", error);
}

// Refresh JWT token
const refreshedToken = await refreshJWT(token, "your-secret-key", {
  extendExpiry: 3600, // Extend by 1 hour
});
```

#### Signature Verification

```typescript
import { 
  verifySignature, 
  verifyEIP712Signature, 
  recoverAddress 
} from "@thirdweb-dev/service-utils";

// Verify simple message signature
const isValid = await verifySignature({
  message: "Please sign this message",
  signature: "0x...",
  address: "0x...",
});

console.log("Signature valid:", isValid);

// Verify EIP-712 typed data signature
const eip712Valid = await verifyEIP712Signature({
  domain: {
    name: "MyApp",
    version: "1",
    chainId: 1,
    verifyingContract: "0x...",
  },
  types: {
    Login: [
      { name: "user", type: "address" },
      { name: "timestamp", type: "uint256" },
    ],
  },
  value: {
    user: "0x...",
    timestamp: Date.now(),
  },
  signature: "0x...",
  expectedAddress: "0x...",
});

// Recover address from signature
const recoveredAddress = await recoverAddress({
  message: "Please sign this message",
  signature: "0x...",
});

console.log("Recovered address:", recoveredAddress);
```

### Data Validation

#### Zod Schema Utilities

```typescript
import { 
  createAPISchema, 
  validateAddress, 
  validateChainId, 
  PaginationSchema,
  AddressSchema,
  ChainIdSchema 
} from "@thirdweb-dev/service-utils";
import { z } from "zod";

// Create API endpoint schema
const CreateContractSchema = createAPISchema({
  body: z.object({
    name: z.string().min(1).max(100),
    symbol: z.string().min(1).max(10),
    ownerAddress: AddressSchema,
    chainId: ChainIdSchema,
    metadata: z.object({
      description: z.string().optional(),
      image: z.string().url().optional(),
    }).optional(),
  }),
  query: PaginationSchema.optional(),
});

// Validate request data
try {
  const validatedData = CreateContractSchema.parse({
    body: {
      name: "My NFT Collection",
      symbol: "MNC",
      ownerAddress: "0x1234567890123456789012345678901234567890",
      chainId: 1,
    },
  });
  
  console.log("Valid data:", validatedData);
} catch (error) {
  console.error("Validation error:", error.errors);
}

// Address validation utility
const isValidAddress = validateAddress("0x1234567890123456789012345678901234567890");
console.log("Address valid:", isValidAddress);

// Chain ID validation
const isValidChain = validateChainId(1);
console.log("Chain ID valid:", isValidChain);
```

#### Custom Validation Schemas

```typescript
import { z } from "zod";
import { 
  createPaginatedResponse, 
  createErrorResponse,
  NFTMetadataSchema 
} from "@thirdweb-dev/service-utils";

// NFT Collection schema
const NFTCollectionSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  name: z.string(),
  symbol: z.string(),
  totalSupply: z.string().regex(/^\d+$/),
  metadata: NFTMetadataSchema.optional(),
});

// API Response schemas
const NFTCollectionListResponse = createPaginatedResponse(NFTCollectionSchema);
const NFTCollectionErrorResponse = createErrorResponse();

// Type inference
type NFTCollection = z.infer<typeof NFTCollectionSchema>;
type NFTCollectionList = z.infer<typeof NFTCollectionListResponse>;
```

### Error Handling

#### Standardized Error Types

```typescript
import { 
  ServiceError, 
  ValidationError, 
  AuthenticationError, 
  NotFoundError, 
  RateLimitError,
  createErrorHandler 
} from "@thirdweb-dev/service-utils";

// Create custom errors
throw new ValidationError("Invalid wallet address format");
throw new AuthenticationError("JWT token expired");
throw new NotFoundError("Contract not found");
throw new RateLimitError("Rate limit exceeded", { retryAfter: 60 });

// Generic service error
throw new ServiceError("Database connection failed", {
  code: "DB_CONNECTION_ERROR",
  statusCode: 500,
  context: { host: "db.example.com", port: 5432 },
});

// Error handler middleware
const errorHandler = createErrorHandler({
  logger: console,
  includeStackTrace: process.env.NODE_ENV === "development",
  sanitizeErrors: true,
});

// Express.js usage
app.use(errorHandler);
```

#### Error Response Formatting

```typescript
import { 
  formatErrorResponse, 
  isServiceError,
  sanitizeError 
} from "@thirdweb-dev/service-utils";

function handleError(error: unknown) {
  if (isServiceError(error)) {
    // Handle known service errors
    return formatErrorResponse({
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      context: error.context,
    });
  }
  
  // Handle unknown errors
  const sanitized = sanitizeError(error);
  return formatErrorResponse({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
    statusCode: 500,
    details: process.env.NODE_ENV === "development" ? sanitized : undefined,
  });
}
```

### Logging Utilities

#### Structured Logging

```typescript
import { 
  createLogger, 
  LogLevel, 
  createRequestLogger 
} from "@thirdweb-dev/service-utils";

// Create structured logger
const logger = createLogger({
  service: "contract-service",
  level: LogLevel.INFO,
  format: "json", // or "text"
  outputs: ["console", "file"],
  metadata: {
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  },
});

// Log with context
logger.info("Contract deployed", {
  contractAddress: "0x...",
  chainId: 1,
  deployerAddress: "0x...",
  transactionHash: "0x...",
});

logger.error("Deployment failed", {
  error: error.message,
  contractType: "ERC721",
  chainId: 1,
});

// Request logging middleware
const requestLogger = createRequestLogger({
  logger,
  includeBody: false,
  includeHeaders: ["user-agent", "x-forwarded-for"],
  excludePaths: ["/health", "/metrics"],
});

// Express.js usage
app.use(requestLogger);
```

#### Performance Monitoring

```typescript
import { 
  createPerformanceTimer, 
  trackMetric, 
  createMetricsCollector 
} from "@thirdweb-dev/service-utils";

// Performance timing
const timer = createPerformanceTimer();
timer.start("database-query");

// ... perform database query
const result = await queryDatabase();

timer.end("database-query");
const duration = timer.getDuration("database-query");

logger.info("Database query completed", {
  duration: `${duration}ms`,
  resultCount: result.length,
});

// Metrics tracking
trackMetric("contracts.deployed", 1, {
  chainId: "1",
  contractType: "ERC721",
});

trackMetric("api.response_time", duration, {
  endpoint: "/api/contracts",
  status: "success",
});

// Metrics collector
const metricsCollector = createMetricsCollector({
  prefix: "thirdweb_service",
  labels: {
    service: "contract-api",
    version: "1.0.0",
  },
});

metricsCollector.incrementCounter("requests_total", {
  method: "POST",
  endpoint: "/deploy",
});
```

### Caching Utilities

#### Redis Caching

```typescript
import { 
  createRedisCache, 
  createMemoryCache, 
  CacheConfig 
} from "@thirdweb-dev/service-utils";

// Redis cache configuration
const redisCache = createRedisCache({
  host: "localhost",
  port: 6379,
  password: "redis-password",
  db: 0,
  keyPrefix: "thirdweb:",
  defaultTTL: 300, // 5 minutes
});

// Set cache value
await redisCache.set("contract:0x123", {
  name: "My Contract",
  symbol: "MC",
  totalSupply: "1000",
}, { ttl: 600 }); // 10 minutes

// Get cache value
const cached = await redisCache.get("contract:0x123");
console.log("Cached data:", cached);

// Cache with automatic serialization
await redisCache.setJSON("user:123:profile", {
  walletAddress: "0x...",
  preferences: { theme: "dark" },
});

const profile = await redisCache.getJSON("user:123:profile");

// Batch operations
await redisCache.mset({
  "contract:0x123": contractData,
  "contract:0x456": anotherContract,
});

const contracts = await redisCache.mget(["contract:0x123", "contract:0x456"]);
```

#### Memory Caching

```typescript
import { createMemoryCache } from "@thirdweb-dev/service-utils";

// In-memory cache for development or small-scale usage
const memoryCache = createMemoryCache({
  maxSize: 1000, // Maximum number of items
  defaultTTL: 300, // 5 minutes
  cleanupInterval: 60, // Cleanup every minute
});

// Same API as Redis cache
await memoryCache.set("key", "value", { ttl: 120 });
const value = await memoryCache.get("key");

// Memory usage monitoring
const stats = memoryCache.getStats();
console.log("Cache stats:", {
  size: stats.size,
  hitRate: stats.hitRate,
  memoryUsage: stats.memoryUsage,
});
```

### Queue Management

#### Job Queue Utilities

```typescript
import { 
  createJobQueue, 
  JobProcessor, 
  JobConfig 
} from "@thirdweb-dev/service-utils";

// Define job processor
const contractDeploymentProcessor: JobProcessor<{
  contractType: string;
  metadata: any;
  chainId: number;
}> = async (job) => {
  logger.info("Processing contract deployment", {
    jobId: job.id,
    contractType: job.data.contractType,
    chainId: job.data.chainId,
  });

  try {
    // Simulate contract deployment
    const result = await deployContract(job.data);
    
    return {
      success: true,
      contractAddress: result.address,
      transactionHash: result.txHash,
    };
  } catch (error) {
    logger.error("Contract deployment failed", {
      jobId: job.id,
      error: error.message,
    });
    throw error;
  }
};

// Create job queue
const deploymentQueue = createJobQueue({
  name: "contract-deployment",
  processor: contractDeploymentProcessor,
  config: {
    concurrency: 5, // Process 5 jobs concurrently
    retries: 3,
    backoff: "exponential",
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 50, // Keep last 50 failed jobs
  },
  redis: {
    host: "localhost",
    port: 6379,
  },
});

// Add job to queue
const job = await deploymentQueue.add("deploy-nft-collection", {
  contractType: "ERC721",
  metadata: {
    name: "My Collection",
    symbol: "MC",
  },
  chainId: 1,
}, {
  delay: 5000, // Delay processing by 5 seconds
  priority: 1, // Higher priority
});

console.log("Job added:", job.id);

// Monitor queue events
deploymentQueue.on("completed", (job, result) => {
  logger.info("Job completed", {
    jobId: job.id,
    result,
  });
});

deploymentQueue.on("failed", (job, error) => {
  logger.error("Job failed", {
    jobId: job.id,
    error: error.message,
  });
});
```

### Cryptographic Utilities

#### Hashing and Encryption

```typescript
import { 
  hashData, 
  verifyHash, 
  encryptData, 
  decryptData, 
  generateSecureToken 
} from "@thirdweb-dev/service-utils";

// Secure hashing
const hashedPassword = await hashData("user-password", {
  algorithm: "argon2", // or "bcrypt", "scrypt"
  saltLength: 32,
});

const isValidPassword = await verifyHash("user-password", hashedPassword);
console.log("Password valid:", isValidPassword);

// Data encryption
const encryptedData = await encryptData({
  message: "sensitive information",
  key: "encryption-key-32-bytes-long!",
  algorithm: "aes-256-gcm",
});

const decryptedData = await decryptData({
  encryptedMessage: encryptedData.encryptedData,
  key: "encryption-key-32-bytes-long!",
  iv: encryptedData.iv,
  tag: encryptedData.tag,
  algorithm: "aes-256-gcm",
});

console.log("Decrypted:", decryptedData);

// Secure token generation
const apiKey = generateSecureToken(64); // 64 bytes = 128 hex characters
const sessionId = generateSecureToken(32); // 32 bytes = 64 hex characters

console.log("API Key:", apiKey);
console.log("Session ID:", sessionId);
```

### Rate Limiting

#### Request Rate Limiting

```typescript
import { 
  createRateLimiter, 
  RateLimitConfig, 
  createRateLimitMiddleware 
} from "@thirdweb-dev/service-utils";

// Create rate limiter
const rateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  max: 100, // Maximum 100 requests per window
  keyGenerator: (req) => req.ip, // Rate limit by IP
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
  store: "redis", // or "memory"
  redis: {
    host: "localhost",
    port: 6379,
  },
});

// Rate limit middleware for Express.js
const rateLimitMiddleware = createRateLimitMiddleware(rateLimiter);
app.use("/api", rateLimitMiddleware);

// Custom rate limiting
app.post("/api/deploy", async (req, res) => {
  const identifier = `deploy:${req.user.id}`;
  
  const result = await rateLimiter.consume(identifier, 1);
  
  if (!result.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded",
      retryAfter: result.retryAfter,
      resetTime: result.resetTime,
    });
  }

  // Process deployment request
  const deployment = await processDeployment(req.body);
  res.json(deployment);
});

// Different rate limits for different endpoints
const deploymentRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 deployments per minute
});

const readRateLimit = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // 1000 reads per minute
});
```

## Configuration Management

### Environment Configuration

```typescript
import { 
  loadConfig, 
  validateConfig, 
  ConfigSchema 
} from "@thirdweb-dev/service-utils";
import { z } from "zod";

// Define configuration schema
const ServiceConfigSchema = z.object({
  port: z.number().default(3000),
  database: z.object({
    host: z.string(),
    port: z.number().default(5432),
    name: z.string(),
    username: z.string(),
    password: z.string(),
  }),
  redis: z.object({
    host: z.string().default("localhost"),
    port: z.number().default(6379),
    password: z.string().optional(),
  }),
  jwt: z.object({
    secret: z.string().min(32),
    expiresIn: z.string().default("1h"),
  }),
  logging: z.object({
    level: z.enum(["debug", "info", "warn", "error"]).default("info"),
    format: z.enum(["json", "text"]).default("json"),
  }),
});

// Load and validate configuration
const config = loadConfig(ServiceConfigSchema, {
  envPrefix: "THIRDWEB_",
  configFiles: ["config.json", "config.local.json"],
  overrides: {
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
  },
});

console.log("Service configuration:", config);

// Type-safe configuration access
const dbConfig = config.database;
const jwtSecret = config.jwt.secret;
```

## API Reference

### Authentication

- `generateJWT(payload, secret, options?)` - Generate JWT token
- `verifyJWT(token, secret)` - Verify JWT token
- `refreshJWT(token, secret, options)` - Refresh JWT token
- `verifySignature(options)` - Verify message signature
- `verifyEIP712Signature(options)` - Verify EIP-712 signature

### Validation

- `createAPISchema(schema)` - Create API endpoint schema
- `validateAddress(address)` - Validate Ethereum address
- `validateChainId(chainId)` - Validate chain ID
- `createPaginatedResponse(schema)` - Create paginated response schema

### Error Handling

- `ServiceError` - Base service error class
- `ValidationError` - Data validation error
- `AuthenticationError` - Authentication error
- `NotFoundError` - Resource not found error
- `RateLimitError` - Rate limit exceeded error

### Logging

- `createLogger(config)` - Create structured logger
- `createRequestLogger(config)` - Create request logging middleware
- `createPerformanceTimer()` - Create performance timer
- `trackMetric(name, value, labels?)` - Track application metrics

### Caching

- `createRedisCache(config)` - Create Redis cache instance
- `createMemoryCache(config)` - Create in-memory cache instance
- `cache.set(key, value, options?)` - Set cache value
- `cache.get(key)` - Get cache value
- `cache.del(key)` - Delete cache value

### Queue Management

- `createJobQueue(config)` - Create job queue
- `queue.add(name, data, options?)` - Add job to queue
- `queue.process(processor)` - Process jobs
- `queue.on(event, handler)` - Listen to queue events

### Cryptography

- `hashData(data, options)` - Hash data securely
- `verifyHash(data, hash)` - Verify hashed data
- `encryptData(options)` - Encrypt data
- `decryptData(options)` - Decrypt data
- `generateSecureToken(bytes)` - Generate secure random token

### Rate Limiting

- `createRateLimiter(config)` - Create rate limiter
- `createRateLimitMiddleware(limiter)` - Create Express middleware
- `limiter.consume(key, tokens)` - Consume rate limit tokens

## Examples

### Complete Service Setup

```typescript
import {
  createLogger,
  createRedisCache,
  createRateLimiter,
  createJobQueue,
  createAPISchema,
  ServiceError,
  loadConfig,
} from "@thirdweb-dev/service-utils";
import { z } from "zod";

class ContractService {
  private logger;
  private cache;
  private rateLimiter;
  private deploymentQueue;

  constructor(config: any) {
    // Initialize logger
    this.logger = createLogger({
      service: "contract-service",
      level: config.logging.level,
      format: config.logging.format,
    });

    // Initialize cache
    this.cache = createRedisCache({
      host: config.redis.host,
      port: config.redis.port,
      password: config.redis.password,
      keyPrefix: "contracts:",
      defaultTTL: 300,
    });

    // Initialize rate limiter
    this.rateLimiter = createRateLimiter({
      windowMs: 60 * 1000,
      max: 10, // 10 deployments per minute
      store: "redis",
      redis: config.redis,
    });

    // Initialize job queue
    this.deploymentQueue = createJobQueue({
      name: "contract-deployment",
      processor: this.processDeployment.bind(this),
      config: {
        concurrency: 3,
        retries: 3,
        backoff: "exponential",
      },
      redis: config.redis,
    });

    this.setupEventHandlers();
  }

  async deployContract(userId: string, contractData: any) {
    // Check rate limit
    const rateLimitResult = await this.rateLimiter.consume(
      `deploy:${userId}`,
      1
    );

    if (!rateLimitResult.allowed) {
      throw new ServiceError("Rate limit exceeded", {
        code: "RATE_LIMIT_EXCEEDED",
        statusCode: 429,
        context: { retryAfter: rateLimitResult.retryAfter },
      });
    }

    // Check cache for existing deployment
    const cacheKey = `deployment:${userId}:${JSON.stringify(contractData)}`;
    const cached = await this.cache.get(cacheKey);
    
    if (cached) {
      this.logger.info("Returning cached deployment", {
        userId,
        cacheKey,
      });
      return cached;
    }

    // Queue deployment job
    const job = await this.deploymentQueue.add("deploy", {
      userId,
      contractData,
      timestamp: Date.now(),
    });

    this.logger.info("Contract deployment queued", {
      userId,
      jobId: job.id,
      contractType: contractData.type,
    });

    return {
      jobId: job.id,
      status: "queued",
      estimatedCompletion: Date.now() + 60000, // 1 minute
    };
  }

  private async processDeployment(job: any) {
    const { userId, contractData } = job.data;

    this.logger.info("Processing contract deployment", {
      jobId: job.id,
      userId,
      contractType: contractData.type,
    });

    try {
      // Simulate deployment process
      await new Promise(resolve => setTimeout(resolve, 5000));

      const result = {
        contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
        transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
        blockNumber: Math.floor(Math.random() * 1000000),
        deployedAt: new Date().toISOString(),
      };

      // Cache the result
      const cacheKey = `deployment:${userId}:${JSON.stringify(contractData)}`;
      await this.cache.set(cacheKey, result, { ttl: 3600 }); // 1 hour

      this.logger.info("Contract deployment completed", {
        jobId: job.id,
        userId,
        contractAddress: result.contractAddress,
      });

      return result;
    } catch (error) {
      this.logger.error("Contract deployment failed", {
        jobId: job.id,
        userId,
        error: error.message,
      });
      throw error;
    }
  }

  private setupEventHandlers() {
    this.deploymentQueue.on("completed", (job, result) => {
      this.logger.info("Deployment job completed", {
        jobId: job.id,
        contractAddress: result.contractAddress,
      });
    });

    this.deploymentQueue.on("failed", (job, error) => {
      this.logger.error("Deployment job failed", {
        jobId: job.id,
        error: error.message,
      });
    });
  }

  async getDeploymentStatus(jobId: string) {
    const job = await this.deploymentQueue.getJob(jobId);
    
    if (!job) {
      throw new ServiceError("Job not found", {
        code: "JOB_NOT_FOUND",
        statusCode: 404,
      });
    }

    return {
      id: job.id,
      status: await job.getState(),
      progress: job.progress(),
      result: job.returnvalue,
      error: job.failedReason,
      createdAt: new Date(job.timestamp),
      processedAt: job.processedOn ? new Date(job.processedOn) : null,
      finishedAt: job.finishedOn ? new Date(job.finishedOn) : null,
    };
  }
}

// Usage
const config = loadConfig(ServiceConfigSchema);
const contractService = new ContractService(config);

// Deploy contract
const deployment = await contractService.deployContract("user123", {
  type: "ERC721",
  name: "My NFT Collection",
  symbol: "MNC",
});

console.log("Deployment queued:", deployment);
```

## References

### Documentation
- [Service Utils Guide](https://portal.thirdweb.com/infrastructure/service-utils) - Complete service utilities guide
- [Authentication Utilities](https://portal.thirdweb.com/infrastructure/auth-utils) - Authentication helper documentation
- [Caching Strategies](https://portal.thirdweb.com/infrastructure/caching) - Caching best practices

### Platform-Specific Guides
- [Cloudflare Workers Setup](https://portal.thirdweb.com/infrastructure/cloudflare-workers) - Using service-utils in Cloudflare Workers
- [Node.js Integration](https://portal.thirdweb.com/infrastructure/nodejs) - Node.js specific utilities and patterns
- [Docker Deployment](https://portal.thirdweb.com/infrastructure/docker) - Containerized service deployment

### Integration Examples
- [Service Utils Examples](https://github.com/thirdweb-example/service-utils-examples) - Example implementations
- [Microservice Template](https://github.com/thirdweb-example/microservice-template) - Complete microservice template
- [API Gateway Pattern](https://github.com/thirdweb-example/api-gateway) - API gateway implementation

### Advanced Topics
- [Error Handling Patterns](https://portal.thirdweb.com/infrastructure/error-handling) - Error handling best practices
- [Logging and Monitoring](https://portal.thirdweb.com/infrastructure/logging) - Structured logging and monitoring
- [Performance Optimization](https://portal.thirdweb.com/infrastructure/performance) - Service performance optimization

### Related Packages
- [Zod Documentation](https://zod.dev/) - Schema validation library
- [Redis Documentation](https://redis.io/docs) - Redis caching and data structures
- [Bull Queue](https://github.com/OptimalBits/bull) - Job queue processing

### Community and Support
- [Discord #infrastructure](https://discord.gg/thirdweb) - Infrastructure and backend help
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report service-utils issues
- [Service Uptime](https://status.thirdweb.com/) - thirdweb services status and uptime
