import { JSONRPCError } from './interfaces';
export declare const ErrorType: Record<string, JSONRPCError>;
export declare const getProviderErrors: (providerError: JSONRPCError, data?: any) => {
    data: any;
    code: import("./interfaces").JSONRPCErrorCode;
    message: string;
};
