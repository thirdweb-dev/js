import { serverContext } from "@/lib/serverContext";
import type GithubSlugger from "github-slugger";

export const sluggerContext = serverContext<GithubSlugger>();
