import type { Team } from "@/api/team";

// Note: Growth legacy is considered higher tier in this hierarchy
export const planToTierRecordForGating: Record<Team["billingPlan"], number> = {
  free: 0,
  starter_legacy: 1,
  starter: 2,
  growth: 3,
  accelerate: 4,
  growth_legacy: 5,
  scale: 6,
  pro: 7,
};
