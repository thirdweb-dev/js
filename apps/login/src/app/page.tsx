import { signJWT } from "./authorization/jwt";
import { LoginPageInner } from "./components/LoginPageInner";

export default function Page() {
  return <LoginPageInner generateJWT={signJWT} />;
}
