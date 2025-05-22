type ErrorCode =
  | "INVALID_INPUT"
  | "ROUTE_NOT_FOUND"
  | "AMOUNT_TOO_LOW"
  | "AMOUNT_TOO_HIGH"
  | "UNKNOWN_ERROR";

export class ApiError extends Error {
  code: ErrorCode;
  correlationId?: string;
  statusCode: number;

  constructor(args: {
    code: ErrorCode;
    message: string;
    statusCode: number;
    correlationId?: string;
  }) {
    super(args.message);
    this.code = args.code;
    this.correlationId = args.correlationId;
    this.statusCode = args.statusCode;
  }
}
