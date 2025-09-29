import { createMetadata } from "@doc";
import GithubSlugger from "github-slugger";
import Link from "next/link";
import ReactHtmlParser from "react-html-parser";
import { Heading } from "@/components/Document";
import { RenderDate } from "./components/RenderData";
import { fetchChangeLogs, fetchPost } from "./ghost";
import { transform } from "./utils/transform";
import "./[slug]/styles.css";

export const metadata = createMetadata({
  description:
    "View the latest updates and changes in thirdweb SDKs and services",
  image: {
    icon: "changelog",
    title: "thirdweb Changelog",
  },
  title: "Changelog",
});

export default async function Page() {
  return (
    <main data-noindex>
      <div className="border-b py-12 border-dashed">
        <div className="container">
          <h1 className="font-semibold text-4xl tracking-tight">Changelog</h1>
        </div>
      </div>

      <div className="container">
        <PageContent />
      </div>
    </main>
  );
}

async function PageContent() {
  const posts = await fetchChangeLogs();
  const slugger = new GithubSlugger();

  return (
    <div className="changelog-page overflow-hidden">
      <div className="flex flex-col gap-10 xl:border-l border-dashed xl:pl-16 max-w-4xl ml-auto pb-20">
        {posts.map((post) => {
          return (
            <div className="relative pt-10" key={post.id}>
              <div className="-left-16 -translate-x-full absolute top-12 hidden xl:flex gap-5 ml-3 items-center">
                {post.published_at && (
                  <div className="hidden xl:block text-sm text-muted-foreground">
                    <RenderDate iso={post.published_at} />
                  </div>
                )}
                <div className="size-6 rounded-[50%] border bg-background flex items-center justify-center">
                  <div className="size-2 bg-blue-500 rounded-full" />
                </div>
              </div>

              <div>
                {post.published_at && (
                  <div className="xl:hidden inline-flex rounded-full border px-3 py-2 mb-4 text-muted-foreground text-xs bg-card">
                    <RenderDate iso={post.published_at} />
                  </div>
                )}

                <div className="space-y-3 mb-5">
                  <Heading
                    anchorClassName="[&>a]:hidden m-0"
                    anchorId={slugger.slug(post.title || "")}
                    // eslint-disable-next-line tailwindcss/no-custom-classname
                    className="changelog-title"
                    level={2}
                  >
                    <Link
                      className="!text-foreground font-semibold text-3xl md:text-4xl tracking-tight hover:underline !leading-tight"
                      href={`/changelog/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Heading>
                </div>
                <div className="text-muted-foreground">
                  <RenderChangelogContent slug={post.slug} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function RenderChangelogContent(props: { slug: string }) {
  const data = (await fetchPost(props.slug))[0];

  if (!data) {
    return null;
  }

  return (
    <>
      {ReactHtmlParser(data.html || "", {
        transform,
      })}
    </>
  );
}
