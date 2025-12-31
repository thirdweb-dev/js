import { NextResponse } from "next/server";
import { getAuthToken } from "@/api/auth-token";
import { getYearInReview } from "@/api/rewind/get-year-in-review";
import { getTeams } from "@/api/team/get-team";
import { loginRedirect } from "@/utils/redirects";

export async function GET() {
  const authToken = await getAuthToken();
  if (!authToken) {
    return loginRedirect("/account/rewind");
  }

  try {
    const teams = await getTeams();
    const teamIds = teams?.map((t) => t.id) || [];

    // Hardcoded to 2025
    const stats = await getYearInReview(authToken, teamIds);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Failed to fetch year in review:", error);
    return NextResponse.json(
      { error: "Failed to fetch year in review" },
      { status: 500 },
    );
  }
}
