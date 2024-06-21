import { NextResponse } from "next/server";

export const errorResponse = (message: string, status: 400 | 500) => {
  return NextResponse.json(
    { message },
    {
      status,
    },
  );
};

export const redirectResponse = (url: string, status: 200 | 302) => {
  return NextResponse.redirect(url, {
    status,
  });
};

export const successHtmlResponse = (htmlResponse: string, status: 200) => {
  return new NextResponse(htmlResponse, {
    status,
  });
};
