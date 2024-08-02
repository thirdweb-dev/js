import { serverContext } from "@/lib/serverContext";
import GithubSlugger from "github-slugger";

export const sluggerContext = serverContext<GithubSlugger>();
