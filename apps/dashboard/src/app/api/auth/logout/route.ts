import { doLogout } from "../../../login/auth-actions";

export const POST = async () => {
  await doLogout();
  return new Response(null, { status: 200 });
};
