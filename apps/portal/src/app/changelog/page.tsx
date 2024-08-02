import { Heading } from "@/components/Document";
import { fetchChangeLogs, fetchPost } from "./ghost";
import { Author } from "./components/Author";
import Link from "next/link";
import { RenderDate } from "./components/RenderData";
import { createMetadata } from "@doc";
import ReactHtmlParser from "react-html-parser";
import { transform } from "./utils/transform";
import { PlusIcon } from "lucide-react";
import GithubSlugger from "github-slugger";
import { ChangelogIndexTOC } from "./components/ChangeLogIndexTOC";
import "./[slug]/styles.css";

export const metadata = createMetadata({
	title: "Changelog",
	description:
		"View the latest updates and changes in thirdweb SDKs and services",
	image: {
		title: "thirdweb Changelog",
		icon: "changelog",
	},
});

export default async function Page() {
	return (
		<main className="container" data-noindex>
			<div className="flex justify-between gap-16">
				<div className="w-full max-w-[850px] grow-0 ">
					<PageContent />
				</div>
				<ChangelogIndexTOC />
			</div>
		</main>
	);
}

async function PageContent() {
	const posts = await fetchChangeLogs();
	const slugger = new GithubSlugger();

	return (
		<div className="changelog-page py-6">
			<h1 className="mb-10 text-3xl font-semibold tracking-tighter">
				Changelog
			</h1>

			<div className="flex flex-col gap-10 xl:border-l-2 xl:pl-12">
				{posts.map((post) => {
					return (
						<div key={post.id} className="relative pb-10">
							<div className="mb-2 flex items-center gap-5">
								{post.published_at && (
									<RenderDate iso={post.published_at} className="text-base" />
								)}
								<div className="flex gap-5">
									{post.authors?.map((author) => {
										return (
											<Author
												name={author.name || ""}
												profileImage={author.profile_image}
												key={author.id}
											/>
										);
									})}
								</div>
							</div>

							<div className="absolute -left-12 top-12 hidden size-7 -translate-x-1/2 items-center justify-center rounded-[50%] bg-f-100 md:size-10 xl:flex">
								<PlusIcon className="size-6 text-b-900" />
							</div>

							<div className="overflow-hidden">
								<Heading
									level={2}
									// eslint-disable-next-line tailwindcss/no-custom-classname
									className="changelog-title"
									id={slugger.slug(post.title || "")}
									anchorClassName="[&>a]:hidden m-0 border-b pb-5 mb-5"
								>
									<Link
										href={`/changelog/${post.slug}`}
										className="text-3xl font-bold tracking-tighter !text-f-100 hover:underline md:text-4xl xl:text-5xl"
									>
										{post.title}
									</Link>
								</Heading>

								<RenderChangelogContent slug={post.slug} />
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
