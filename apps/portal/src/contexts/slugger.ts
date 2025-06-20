import type GithubSlugger from "github-slugger";
import { serverContext } from "@/lib/serverContext";

export const sluggerContext = serverContext<GithubSlugger>();
