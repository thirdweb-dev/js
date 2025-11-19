import type { Project } from "@/api/project/projects";

type X402Fee = {
  feeRecipient: string;
  feeBps: number;
};

/**
 * Extract x402 fee configuration from project's engineCloud service
 */
export function getX402Fees(project: Project): X402Fee {
  const engineCloudService = project.services.find(
    (service) => service.name === "engineCloud",
  );

  if (!engineCloudService) {
    return {
      feeRecipient: "",
      feeBps: 0,
    };
  }

  return {
    feeRecipient: engineCloudService.x402FeeRecipient || "",
    feeBps: engineCloudService.x402FeeBPS || 0,
  };
}
