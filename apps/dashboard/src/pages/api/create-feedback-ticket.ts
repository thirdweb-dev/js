import { NextRequest } from "next/server";
import { errorResponse } from "utils/api";

export const config = {
  runtime: "edge",
};

const handler = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return errorResponse("Invalid method", 400);
  }
};
