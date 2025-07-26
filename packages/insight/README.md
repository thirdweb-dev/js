# Insight SDK

## Description

The **@thirdweb-dev/insight** package is a TypeScript SDK for interacting with thirdweb's Insight service, a comprehensive analytics and monitoring platform for web3 applications. Insight provides real-time metrics, transaction tracking, user behavior analysis, and performance monitoring to help developers understand and optimize their decentralized applications.

### Key Features

- **Real-time Analytics**: Live dashboards and metrics for your web3 applications
- **Transaction Monitoring**: Track and analyze all blockchain transactions
- **User Behavior Analytics**: Understand user interactions and usage patterns
- **Performance Metrics**: Monitor application performance and response times
- **Custom Events Tracking**: Track application-specific events and conversions
- **Revenue Analytics**: Monitor revenue streams and financial metrics
- **Smart Contract Analytics**: Deep insights into smart contract usage and performance
- **Multi-chain Support**: Analytics across all supported blockchain networks
- **Alerting System**: Real-time alerts for critical metrics and events
- **Data Export**: Export analytics data for further analysis

## Installation

```bash
npm install @thirdweb-dev/insight
```

### Prerequisites

To use the Insight SDK, you need:

1. **Insight Service Access**: Access to thirdweb's Insight analytics platform
2. **API Credentials**: Valid secret key or authentication token
3. **Project Configuration**: Configured project with tracking enabled

## Usage

### Basic Setup

#### 1. Configure Insight Client

```typescript
import { configure } from "@thirdweb-dev/insight";

// Configure once at application startup
configure({
  secretKey: "YOUR_SECRET_KEY",
  projectId: "your-project-id",
  baseUrl: "https://insight-api.thirdweb.com", // Optional: custom endpoint
});
```

#### 2. Alternative Configuration with thirdweb Client

```typescript
import { configureWithClient } from "@thirdweb-dev/insight";
import { createThirdwebClient } from "thirdweb";

const thirdwebClient = createThirdwebClient({
  secretKey: "YOUR_SECRET_KEY",
});

configureWithClient(thirdwebClient);
```

### Analytics Tracking

#### Track Custom Events

```typescript
import { trackEvent } from "@thirdweb-dev/insight";

// Track user interactions
await trackEvent({
  eventName: "nft_minted",
  properties: {
    contractAddress: "0x1234567890123456789012345678901234567890",
    tokenId: "123",
    price: "0.1",
    currency: "ETH",
    userId: "user123",
    walletAddress: "0x...",
  },
  timestamp: Date.now(),
});

// Track conversions
await trackEvent({
  eventName: "purchase_completed",
  properties: {
    orderId: "order_456",
    amount: "50.00",
    currency: "USDC",
    paymentMethod: "wallet",
    items: [
      { id: "nft_123", name: "Cool NFT", price: "50.00" }
    ],
  },
});
```

#### Track Page Views

```typescript
import { trackPageView } from "@thirdweb-dev/insight";

await trackPageView({
  page: "/marketplace",
  title: "NFT Marketplace",
  userId: "user123",
  walletAddress: "0x...",
  properties: {
    category: "marketplace",
    featured: true,
    collectionCount: 25,
  },
});
```

#### Track User Sessions

```typescript
import { startSession, endSession } from "@thirdweb-dev/insight";

// Start tracking user session
const sessionId = await startSession({
  userId: "user123",
  walletAddress: "0x...",
  userAgent: navigator.userAgent,
  referrer: document.referrer,
  properties: {
    platform: "web",
    version: "1.0.0",
  },
});

// End session (call when user leaves or after timeout)
await endSession({
  sessionId,
  duration: 1800000, // 30 minutes in ms
  eventsCount: 15,
  properties: {
    exitPage: "/profile",
    bounceRate: false,
  },
});
```

### Transaction Analytics

#### Track Transactions

```typescript
import { trackTransaction } from "@thirdweb-dev/insight";

await trackTransaction({
  transactionHash: "0xabc123...",
  chainId: 1,
  fromAddress: "0x...",
  toAddress: "0x...",
  value: "1000000000000000000", // 1 ETH in wei
  gasUsed: "21000",
  gasPrice: "20000000000", // 20 gwei
  status: "success", // or "failed", "pending"
  blockNumber: 18500000,
  timestamp: Date.now(),
  contractAddress: "0x...", // if contract interaction
  functionName: "transfer", // if contract call
  eventType: "nft_purchase",
  userId: "user123",
});
```

#### Track Contract Interactions

```typescript
import { trackContractInteraction } from "@thirdweb-dev/insight";

await trackContractInteraction({
  contractAddress: "0x...",
  functionName: "mint",
  parameters: {
    to: "0x...",
    amount: "5",
    tokenId: "123",
  },
  transactionHash: "0x...",
  gasUsed: "85000",
  status: "success",
  userId: "user123",
  eventProperties: {
    mintType: "public",
    mintPrice: "0.05",
  },
});
```

### Data Retrieval and Analytics

#### Get Analytics Overview

```typescript
import { getAnalyticsOverview } from "@thirdweb-dev/insight";

const overview = await getAnalyticsOverview({
  projectId: "your-project-id",
  timeRange: {
    start: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    end: Date.now(),
  },
  metrics: [
    "users",
    "sessions", 
    "transactions",
    "revenue",
    "gas_used"
  ],
});

console.log("Analytics overview:", overview.data);

// Example response:
// {
//   totalUsers: 1250,
//   activeUsers: 89,
//   totalSessions: 2100,
//   totalTransactions: 850,
//   totalRevenue: "12.5", // ETH
//   totalGasUsed: "2500000",
//   conversionRate: 0.12
// }
```

#### Get User Analytics

```typescript
import { getUserAnalytics } from "@thirdweb-dev/insight";

const userAnalytics = await getUserAnalytics({
  projectId: "your-project-id",
  timeRange: {
    start: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days
    end: Date.now(),
  },
  segmentation: {
    newUsers: true,
    returningUsers: true,
    walletType: ["metamask", "coinbase", "walletconnect"],
  },
});

console.log("User analytics:", userAnalytics.data);
```

#### Get Transaction Analytics

```typescript
import { getTransactionAnalytics } from "@thirdweb-dev/insight";

const txAnalytics = await getTransactionAnalytics({
  projectId: "your-project-id",
  timeRange: {
    start: Date.now() - 24 * 60 * 60 * 1000, // 24 hours
    end: Date.now(),
  },
  filters: {
    chainIds: [1, 137, 42161], // Ethereum, Polygon, Arbitrum
    contractAddresses: ["0x..."],
    status: ["success"],
    minValue: "0.01", // Minimum 0.01 ETH
  },
  groupBy: "hour",
});

console.log("Transaction analytics:", txAnalytics.data);
```

### Real-time Monitoring

#### Get Live Metrics

```typescript
import { getLiveMetrics } from "@thirdweb-dev/insight";

const liveMetrics = await getLiveMetrics({
  projectId: "your-project-id",
  metrics: [
    "active_users_now",
    "transactions_per_minute",
    "revenue_per_hour",
    "gas_price_avg",
  ],
});

console.log("Live metrics:", liveMetrics.data);

// Example response:
// {
//   activeUsersNow: 23,
//   transactionsPerMinute: 2.5,
//   revenuePerHour: "0.8", // ETH
//   gasPriceAvg: "25000000000" // 25 gwei
// }
```

#### Set Up Real-time Alerts

```typescript
import { createAlert } from "@thirdweb-dev/insight";

const alert = await createAlert({
  name: "High Gas Usage Alert",
  description: "Alert when gas usage exceeds threshold",
  conditions: {
    metric: "gas_used_per_transaction",
    operator: "greater_than",
    threshold: 500000,
    timeWindow: "5m", // 5 minutes
  },
  notifications: [
    {
      type: "email",
      recipients: ["dev@company.com"],
    },
    {
      type: "webhook",
      url: "https://api.company.com/alerts",
      headers: {
        "Authorization": "Bearer token123",
      },
    },
    {
      type: "slack",
      channel: "#dev-alerts",
      webhook: "https://hooks.slack.com/...",
    },
  ],
  enabled: true,
});

console.log("Alert created:", alert.data.alertId);
```

### Custom Dashboards

#### Create Custom Dashboard

```typescript
import { createDashboard } from "@thirdweb-dev/insight";

const dashboard = await createDashboard({
  name: "NFT Marketplace Dashboard",
  description: "Key metrics for NFT marketplace performance",
  widgets: [
    {
      type: "metric",
      title: "Total Sales",
      metric: "revenue",
      timeRange: "30d",
      visualization: "number",
    },
    {
      type: "chart",
      title: "Daily Active Users",
      metric: "active_users",
      timeRange: "30d",
      visualization: "line_chart",
      groupBy: "day",
    },
    {
      type: "table",
      title: "Top Selling NFTs",
      query: {
        event: "nft_sold",
        groupBy: "token_id",
        orderBy: "count",
        limit: 10,
      },
    },
  ],
  layout: {
    columns: 3,
    rows: 2,
  },
  isPublic: false,
});
```

#### Get Dashboard Data

```typescript
import { getDashboardData } from "@thirdweb-dev/insight";

const dashboardData = await getDashboardData({
  dashboardId: "dashboard-123",
  timeRange: {
    start: Date.now() - 7 * 24 * 60 * 60 * 1000,
    end: Date.now(),
  },
  refreshCache: true,
});

console.log("Dashboard data:", dashboardData.data);
```

### Advanced Analytics

#### Funnel Analysis

```typescript
import { createFunnel } from "@thirdweb-dev/insight";

const funnel = await createFunnel({
  name: "NFT Purchase Funnel",
  steps: [
    {
      name: "Visited Marketplace",
      event: "page_view",
      filters: { page: "/marketplace" },
    },
    {
      name: "Viewed NFT",
      event: "nft_viewed",
    },
    {
      name: "Added to Cart",
      event: "add_to_cart",
    },
    {
      name: "Initiated Purchase",
      event: "purchase_initiated",
    },
    {
      name: "Completed Purchase",
      event: "purchase_completed",
    },
  ],
  timeWindow: "1d", // Users must complete funnel within 1 day
});

// Get funnel results
const funnelResults = await getFunnelAnalysis({
  funnelId: funnel.data.funnelId,
  timeRange: {
    start: Date.now() - 30 * 24 * 60 * 60 * 1000,
    end: Date.now(),
  },
});
```

#### Cohort Analysis

```typescript
import { createCohortAnalysis } from "@thirdweb-dev/insight";

const cohortAnalysis = await createCohortAnalysis({
  name: "User Retention Cohorts",
  cohortDefinition: {
    type: "first_transaction",
    timeGranularity: "week",
  },
  retentionDefinition: {
    event: "transaction",
    timeGranularity: "week",
    periods: 12, // Track for 12 weeks
  },
  timeRange: {
    start: Date.now() - 90 * 24 * 60 * 60 * 1000, // 90 days
    end: Date.now(),
  },
});
```

### Data Export and Integration

#### Export Analytics Data

```typescript
import { exportData } from "@thirdweb-dev/insight";

const exportJob = await exportData({
  format: "csv", // or "json", "parquet"
  data: {
    events: {
      eventNames: ["nft_minted", "nft_sold"],
      timeRange: {
        start: Date.now() - 30 * 24 * 60 * 60 * 1000,
        end: Date.now(),
      },
    },
    users: {
      includeProperties: true,
      activeOnly: false,
    },
    transactions: {
      chainIds: [1, 137],
      includeContractData: true,
    },
  },
  delivery: {
    method: "email",
    recipients: ["data@company.com"],
  },
});

console.log("Export job created:", exportJob.data.jobId);
```

#### Integration with External Tools

```typescript
import { createIntegration } from "@thirdweb-dev/insight";

// Google Analytics integration
const gaIntegration = await createIntegration({
  type: "google_analytics",
  name: "GA4 Integration",
  configuration: {
    measurementId: "G-XXXXXXXXXX",
    apiSecret: "your-api-secret",
    mappings: {
      "nft_minted": "purchase",
      "nft_sold": "conversion",
    },
  },
  enabled: true,
});

// Mixpanel integration
const mixpanelIntegration = await createIntegration({
  type: "mixpanel",
  name: "Mixpanel Analytics",
  configuration: {
    projectToken: "your-project-token",
    apiSecret: "your-api-secret",
    syncEvents: ["all"],
    syncUsers: true,
  },
  enabled: true,
});
```

## Configuration Options

### Client Configuration

```typescript
import { configure } from "@thirdweb-dev/insight";

configure({
  secretKey: "your-secret-key",
  projectId: "your-project-id",
  baseUrl: "https://insight-api.thirdweb.com",
  
  // Optional configuration
  timeout: 30000, // Request timeout in ms
  retries: 3, // Number of retries for failed requests
  batchSize: 100, // Events per batch
  flushInterval: 5000, // Auto-flush interval in ms
  
  // Data collection settings
  sampling: {
    enabled: false, // Disable sampling for complete data
    rate: 0.1, // Sample 10% of events (if enabled)
  },
  
  // Privacy settings
  privacy: {
    anonymizeIPs: true,
    respectDoNotTrack: true,
    cookieConsent: true,
  },
  
  // Error handling
  errorHandling: {
    silentErrors: false,
    logErrors: true,
    maxRetries: 3,
  },
});
```

### Tracking Configuration

```typescript
const trackingConfig = {
  // Automatic tracking
  autoTrack: {
    pageViews: true,
    clicks: true,
    formSubmissions: false,
    scrollDepth: true,
    timeOnPage: true,
  },
  
  // Custom properties to include with all events
  globalProperties: {
    appVersion: "1.0.0",
    environment: "production",
    userId: () => getCurrentUserId(),
    sessionId: () => getSessionId(),
  },
  
  // Event filtering
  filters: {
    excludeEvents: ["debug_event"],
    includeOnlyEvents: [], // Empty means include all
    excludeBots: true,
    excludeLocalhost: true,
  },
};
```

## API Reference

### Core Functions

- `configure(options)` - Configure the Insight client
- `configureWithClient(client)` - Configure with thirdweb client
- `trackEvent(event)` - Track custom events
- `trackPageView(pageView)` - Track page views
- `trackTransaction(transaction)` - Track blockchain transactions

### Analytics Functions

- `getAnalyticsOverview(options)` - Get high-level analytics overview
- `getUserAnalytics(options)` - Get user behavior analytics
- `getTransactionAnalytics(options)` - Get transaction analytics
- `getRevenueAnalytics(options)` - Get revenue and financial metrics

### Real-time Functions

- `getLiveMetrics(options)` - Get real-time metrics
- `createAlert(alert)` - Create monitoring alerts
- `subscribeToMetrics(callback)` - Subscribe to real-time updates

### Dashboard Functions

- `createDashboard(dashboard)` - Create custom dashboard
- `getDashboardData(options)` - Get dashboard data
- `updateDashboard(dashboardId, updates)` - Update dashboard configuration

### Advanced Analytics

- `createFunnel(funnel)` - Create conversion funnel
- `getFunnelAnalysis(options)` - Get funnel analysis results
- `createCohortAnalysis(cohort)` - Create cohort analysis
- `exportData(options)` - Export analytics data

## Examples

### Complete Analytics Integration

```typescript
import { 
  configure, 
  trackEvent, 
  trackPageView, 
  getAnalyticsOverview,
  createAlert
} from "@thirdweb-dev/insight";

class AnalyticsService {
  constructor(secretKey: string, projectId: string) {
    configure({
      secretKey,
      projectId,
      batchSize: 50,
      flushInterval: 3000,
    });
  }

  // Track NFT marketplace events
  async trackNFTEvent(eventType: string, data: any) {
    await trackEvent({
      eventName: eventType,
      properties: {
        ...data,
        timestamp: Date.now(),
        source: "marketplace",
      },
    });
  }

  // Track user journey
  async trackUserJourney(userId: string, walletAddress: string) {
    // Track page views
    await trackPageView({
      page: window.location.pathname,
      title: document.title,
      userId,
      walletAddress,
      properties: {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      },
    });

    // Set up conversion tracking
    await this.setupConversionTracking(userId);
  }

  // Get comprehensive analytics
  async getMarketplaceAnalytics(timeRange: any) {
    const overview = await getAnalyticsOverview({
      projectId: this.projectId,
      timeRange,
      metrics: [
        "users",
        "sessions",
        "transactions", 
        "revenue",
        "conversion_rate"
      ],
    });

    return {
      overview: overview.data,
      insights: this.generateInsights(overview.data),
    };
  }

  // Set up monitoring
  async setupMonitoring() {
    // High gas usage alert
    await createAlert({
      name: "High Gas Alert",
      conditions: {
        metric: "avg_gas_used",
        operator: "greater_than",
        threshold: 300000,
        timeWindow: "10m",
      },
      notifications: [{
        type: "email",
        recipients: ["ops@company.com"],
      }],
    });

    // Low conversion rate alert
    await createAlert({
      name: "Low Conversion Alert",
      conditions: {
        metric: "conversion_rate",
        operator: "less_than",
        threshold: 0.05, // 5%
        timeWindow: "1h",
      },
      notifications: [{
        type: "slack",
        webhook: "https://hooks.slack.com/...",
      }],
    });
  }

  private async setupConversionTracking(userId: string) {
    // Track key conversion events
    const conversionEvents = [
      "nft_viewed",
      "add_to_cart", 
      "purchase_initiated",
      "purchase_completed"
    ];

    // Set up event listeners for conversion tracking
    conversionEvents.forEach(event => {
      document.addEventListener(event, (e: any) => {
        this.trackNFTEvent(event, {
          userId,
          ...e.detail,
        });
      });
    });
  }

  private generateInsights(data: any) {
    const insights = [];
    
    if (data.conversionRate < 0.05) {
      insights.push("Conversion rate is below 5% - consider optimizing the purchase flow");
    }
    
    if (data.totalGasUsed > data.totalTransactions * 200000) {
      insights.push("Average gas usage is high - consider gas optimization");
    }
    
    return insights;
  }
}

// Usage
const analytics = new AnalyticsService("your-secret-key", "your-project-id");

// Track NFT mint
await analytics.trackNFTEvent("nft_minted", {
  contractAddress: "0x...",
  tokenId: "123",
  price: "0.1",
  currency: "ETH",
  userId: "user123",
});

// Get analytics
const marketplaceData = await analytics.getMarketplaceAnalytics({
  start: Date.now() - 30 * 24 * 60 * 60 * 1000,
  end: Date.now(),
});
```

### Real-time Dashboard

```typescript
import { 
  getLiveMetrics, 
  createDashboard,
  subscribeToMetrics 
} from "@thirdweb-dev/insight";

class RealTimeDashboard {
  private metrics: any = {};
  private subscribers: any[] = [];

  async initialize() {
    // Create dashboard
    const dashboard = await createDashboard({
      name: "Live NFT Marketplace",
      widgets: [
        {
          type: "metric",
          title: "Active Users",
          metric: "active_users_now",
          visualization: "number",
        },
        {
          type: "chart", 
          title: "Transactions/Min",
          metric: "transactions_per_minute",
          visualization: "gauge",
        },
      ],
    });

    // Subscribe to real-time updates
    subscribeToMetrics((data) => {
      this.updateMetrics(data);
      this.notifySubscribers(data);
    });

    // Start periodic updates
    this.startPeriodicUpdates();
  }

  private async startPeriodicUpdates() {
    setInterval(async () => {
      const liveMetrics = await getLiveMetrics({
        projectId: "your-project-id",
        metrics: [
          "active_users_now",
          "transactions_per_minute",
          "revenue_per_hour",
        ],
      });

      this.updateMetrics(liveMetrics.data);
    }, 30000); // Update every 30 seconds
  }

  private updateMetrics(data: any) {
    this.metrics = { ...this.metrics, ...data };
  }

  private notifySubscribers(data: any) {
    this.subscribers.forEach(callback => callback(data));
  }

  subscribe(callback: (data: any) => void) {
    this.subscribers.push(callback);
  }

  getCurrentMetrics() {
    return this.metrics;
  }
}
```

## References

### Documentation
- [Insight Documentation](https://portal.thirdweb.com/insight) - Complete Insight guide
- [Analytics Setup Guide](https://portal.thirdweb.com/insight/setup) - Getting started with analytics
- [Custom Events Guide](https://portal.thirdweb.com/insight/events) - Tracking custom events

### Analytics Features
- [Real-time Monitoring](https://portal.thirdweb.com/insight/real-time) - Live metrics and alerts
- [Custom Dashboards](https://portal.thirdweb.com/insight/dashboards) - Building custom dashboards
- [Data Export](https://portal.thirdweb.com/insight/export) - Exporting analytics data

### Integration Examples
- [Insight Examples](https://github.com/thirdweb-example/insight-examples) - Example implementations
- [E-commerce Analytics](https://github.com/thirdweb-example/insight-ecommerce) - E-commerce tracking
- [DeFi Analytics](https://github.com/thirdweb-example/insight-defi) - DeFi protocol analytics

### Advanced Topics
- [Funnel Analysis](https://portal.thirdweb.com/insight/funnels) - Conversion funnel tracking
- [Cohort Analysis](https://portal.thirdweb.com/insight/cohorts) - User retention analysis  
- [A/B Testing](https://portal.thirdweb.com/insight/ab-testing) - Experiment tracking

### API References
- [Insight API Reference](https://insight-api.thirdweb.com/docs) - Complete API documentation
- [Event Schema](https://portal.thirdweb.com/insight/event-schema) - Event data structure
- [Rate Limits](https://portal.thirdweb.com/insight/rate-limits) - Usage limits and quotas

### Privacy and Compliance
- [Privacy Guide](https://portal.thirdweb.com/insight/privacy) - Privacy-compliant analytics
- [GDPR Compliance](https://portal.thirdweb.com/insight/gdpr) - GDPR compliance features
- [Data Retention](https://portal.thirdweb.com/insight/retention) - Data retention policies

### Community and Support
- [Discord #insight](https://discord.gg/thirdweb) - Insight specific help and discussions
- [GitHub Issues](https://github.com/thirdweb-dev/js/issues) - Report Insight SDK issues
- [Feature Requests](https://feedback.thirdweb.com/insight) - Request new analytics features
