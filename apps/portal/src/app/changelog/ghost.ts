import type { PostsOrPages } from "@tryghost/content-api";
import "./[slug]/styles.css";

const GHOST_THIRDWEB_BLOG_KEY = "49c62b5137df1c17ab6b9e46e3";

export async function fetchChangeLogs() {
  const queryParamsString = Object.entries({
    fields: ["title", "slug", "published_at"].join(","),
    filter: "tag:changelog",
    include: ["authors", "tags"].join(","),
    key: GHOST_THIRDWEB_BLOG_KEY,
    limit: "20",
    order: "published_at DESC",
  })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const res = await fetch(
    `https://thirdweb.ghost.io/ghost/api/content/posts/?${queryParamsString}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();

  return data.posts as PostsOrPages;
}

export async function fetchPost(slug: string) {
  const queryParamsString = Object.entries({
    filter: `slug:${slug}`,
    include: ["authors", "tags"].join(","),
    key: GHOST_THIRDWEB_BLOG_KEY,
    limit: "1",
  })
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  const res = await fetch(
    `https://thirdweb.ghost.io/ghost/api/content/posts/?${queryParamsString}`,
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();

  return data.posts as PostsOrPages;
}
