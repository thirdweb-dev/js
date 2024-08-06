import { search } from "@/app/api/search/searching/search";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const query = searchParams.get("q");

	if (!query) {
		return NextResponse.json({
			results: [],
		});
	}

	const results = await search(query);
	return NextResponse.json(results);
}
