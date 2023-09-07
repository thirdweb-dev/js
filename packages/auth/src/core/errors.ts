import { format } from 'util';

export interface ThirdwebErrorConstructorArgs<Variables = undefined> {
  code: string;
  message: string
  name?: string
  cause?: Error;
  variables: Variables;
}

function formatString(template: string, substitutions: { [key: string]: any }): string {
  return template.replace(/\$\{(\w+)\}/g, (_match, p1) => {
    return substitutions[p1] !== undefined ? substitutions[p1] : _match;
  });
}

export function createError<Variables>(options: Omit<ThirdwebErrorConstructorArgs<Variables>, 'variables'>) {
  class ThirdwebAuthError extends Error {
    public code: string;
    public message: string;
    public cause: Error | null;
    public variables: any;

    constructor(overrideOptions?: Partial<ThirdwebErrorConstructorArgs<Variables>>) {
      const code = overrideOptions?.code ?? options.code;
      const name = overrideOptions?.name ?? 'ThirdwebAuthError';
      const cause = overrideOptions?.cause ?? null;
      const variables = overrideOptions?.variables ?? {}

      const unformattedMessage = overrideOptions?.message ?? options.message;
      const message = formatString(unformattedMessage, variables);

      super(message);

      this.code = code;
      this.message = message;
      this.name = name;
      this.cause = cause;
      this.variables = variables;

      Error.stackTraceLimit !== 0 && Error.captureStackTrace(this, ThirdwebAuthError)
    }
  }

  return ThirdwebAuthError;
}

export const ThirdwebAuthErrors = {
  InvalidTokenId: createError({
    code: 'INVALID_TOKEN_ID',
    message: 'The token ID is invalid.',
  }),

  InvalidTokenDomain: createError<{
    expectedDomain: string;
    actualDomain: string;
  }>({
    code: 'INVALID_TOKEN_DOMAIN',
    message: "Expected token to be for the domain '${expectedDomain}', but found token with domain '${actualDomain}'.",
  }),

  InvalidTokenTimeBefore: createError<{
    notBeforeTime: number;
    currentTime: number;
  }>({
    code: 'INVALID_NOT_BEFORE_TIME',
    message: "This token is invalid before epoch time '${nbf}', current epoch time is '${currentTime}'.",
  }),

  ExpiredToken: createError<{
    expirationTime: number;
    currentTime: number;
  }> ({
    code: 'EXPIRED_TOKEN',
    message: "This token expired at epoch time '${expirationTime}', current epoch time is '${currentTime}'.",
  }),

  TokenIssuerMismatch: createError<{
    expectedIssuer: string;
    actualIssuer: string;
  }> ({
    code: 'TOKEN_ISSUER_MISMATCH',
    message: "Expected token to be issued by '${expectedIssuer}', but found token issued by '${actualIssuer}'.",
  }),

  TokenInvalidSignature: createError<{
    signerAddress: string;
  }> ({
    code: 'TOKEN_INVALID_SIGNATURE',
    message: "The token was signed by '${signerAddress}', but the signature is invalid or missing.",
  })
}