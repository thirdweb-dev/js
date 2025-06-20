import type { Team } from "@/api/team";

// Note: Growth legacy is considered higher tier in this hierarchy
export const planToTierRecordForGating: Record<Team["billingPlan"], number> = {
  accelerate: 4,
  free: 0,
  growth: 3,
  growth_legacy: 5,
  pro: 7,
  scale: 6,
  starter: 1,
};
