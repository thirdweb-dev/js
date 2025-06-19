import Link from "next/link";

const links = [
  {
    title: "Documentation",
    url: "https://docs.thirdweb.com/storage",
  },
  {
    title: "How To Upload And Pin Files to IPFS",
    url: "https://blog.thirdweb.com/guides/how-to-upload-and-pin-files-to-ipfs-using-storage/",
  },
];

const videos = [
  {
    title: "How To Easily Add IPFS Into Your Web3 App",
    url: "https://www.youtube.com/watch?v=4Nnu9Cy7SKc",
  },
  {
    title: "How to Upload Files to IPFS (Step by Step Guide)",
    url: "https://www.youtube.com/watch?v=wyYkpMgEVxE",
  },
];

export function GuidesSection() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <LinkSectionCard title="Guides" links={links} />
      <LinkSectionCard title="Videos" links={videos} />
    </div>
  );
}

function LinkSectionCard(props: {
  title: string;
  links: { title: string; url: string }[];
}) {
  return (
    <div className="flex min-h-[150px] flex-col rounded-lg border border-border p-4">
      <h2 className="mb-3 font-semibold text-xl tracking-tight">
        {props.title}
      </h2>
      <ul className="mt-auto flex flex-col gap-1.5">
        {props.links.map((link) => {
          return (
            <li key={link.url}>
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-muted-foreground hover:text-foreground"
              >
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
