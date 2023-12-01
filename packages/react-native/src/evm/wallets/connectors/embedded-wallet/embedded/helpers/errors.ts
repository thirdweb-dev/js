export const ErrorMessages = {
  invalidOtp:
    "Your OTP code is invalid or expired. Please request a new code or try again.",
  missingRecoveryCode: "Missing encryption key for user",
};

export const createErrorMessage = (message: string, error: any): string => {
  if (error instanceof Error) {
    return `${message}: ${error.message}`;
  } else {
    return `${message}: ${JSON.stringify(error)}`;
  }
};
