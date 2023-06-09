export interface JSONRPCError {
    code: JSONRPCErrorCode;
    message: string;
    data?: any;
}
export declare enum JSONRPCErrorCode {
    ParseError = -32700,
    InvalidRequest = -32600,
    MethodNotFound = -32601,
    InvalidParams = -32602,
    InternalError = -32603,
    NotLogin = 4100
}
