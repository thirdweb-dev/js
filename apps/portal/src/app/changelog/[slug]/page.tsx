/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import ReactHtmlParser from "react-html-parser";
import { fetchChangeLogs, fetchPost } from "../ghost";
import "./styles.css";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { Author } from "../components/Author";
import { RenderDate } from "../components/RenderData";
import { transform } from "../utils/transform";

export default async function Page(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const data = (await fetchPost((await props.params).slug))[0];

  if (!data) {
    notFound();
  }

  return (
    <div className="changelog-page">
      <Button asChild>
        <Link
          href="/changelog"
          className="-translate-x-1/4 !p-2 !text-muted-foreground hover:!text-foreground mb-4 bg-transparent"
        >
          <ArrowLeft className="size-6" />
        </Link>
      </Button>

      {data.updated_at && (
        <div className="mb-10">
          <RenderDate iso={data.updated_at} />
        </div>
      )}

      <h1
        className={cn(
          "mb-8 break-words font-bold text-4xl text-foreground tracking-tight md:text-5xl",
        )}
      >
        {data.title}
      </h1>

      <div className="mb-5 flex items-center gap-5">
        {data.authors?.map((author) => {
          if (!author.name) {
            return null;
          }

          return (
            <Author
              name={author.name}
              profileImage={author.profile_image}
              key={author.id}
            />
          );
        })}
      </div>

      <div className="mb-8 border-t-2" />

      {ReactHtmlParser(data.html || "", {
        transform,
      })}
    </div>
  );
}

export async function generateStaticParams() {
  const changelogs = await fetchChangeLogs();

  return changelogs.map((changelog) => {
    return {
      slug: changelog.slug,
    };
  });
}
