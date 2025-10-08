const PROJECT_WALLET_LABEL_SUFFIX = " Wallet";
const PROJECT_WALLET_LABEL_MAX_LENGTH = 32;

/**
 * Builds the default label for a project's primary server wallet.
 * Ensures a stable naming convention so the wallet can be identified across flows.
 */
export function getProjectWalletLabel(projectName: string | undefined) {
  const baseName = projectName?.trim() || "Project";
  const maxBaseLength = Math.max(
    1,
    PROJECT_WALLET_LABEL_MAX_LENGTH - PROJECT_WALLET_LABEL_SUFFIX.length,
  );

  const normalizedBase =
    baseName.length > maxBaseLength
      ? baseName.slice(0, maxBaseLength).trimEnd()
      : baseName;

  return `${normalizedBase}${PROJECT_WALLET_LABEL_SUFFIX}`;
}
