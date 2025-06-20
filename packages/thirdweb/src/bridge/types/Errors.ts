import { stringify } from "../../utils/json.js";

type ErrorCode =
  | "INVALID_INPUT"
  | "ROUTE_NOT_FOUND"
  | "AMOUNT_TOO_LOW"
  | "AMOUNT_TOO_HIGH"
  | "INTERNAL_SERVER_ERROR"
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

  override toString() {
    return stringify({
      code: this.code,
      correlationId: this.correlationId,
      message: this.message,
      statusCode: this.statusCode,
    });
  }
}
