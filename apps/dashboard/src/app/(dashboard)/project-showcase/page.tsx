import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "../../../@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../@/components/ui/pagination";
import {
  PROJECT_SHOWCASE_DATA,
  PROJECT_SHOWCASE_INDUSTRIES,
  PROJECT_SHOWCASE_ITEMS_PER_PAGE,
} from "../../../lib/project-showcase-constants";
import { getAbsoluteUrl } from "../../../lib/vercel-utils";

export const metadata: Metadata = {
  title: "Project Showcase | Built on thirdweb",
  description: "Discover the latest web3 apps and games built on thirdweb",
  openGraph: {
    title: "Project Showcase | Built on thirdweb",
    description: "Discover the latest web3 apps and games built on thirdweb",
    images: [
      {
        url: `${getAbsoluteUrl()}/assets/showcase/og_image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const dynamic = "force-dynamic";

export default function ProjectShowcasePage({
  searchParams,
}: {
  searchParams: { industry?: string; page?: string };
}) {
  const selectedIndustry = searchParams.industry || "All";
  const currentPage = Number.parseInt(searchParams.page || "1", 10);

  const filteredProjects =
    selectedIndustry === "All"
      ? PROJECT_SHOWCASE_DATA
      : PROJECT_SHOWCASE_DATA.filter((project) =>
          project.industries?.includes(selectedIndustry),
        );

  const totalPages = Math.ceil(
    filteredProjects.length / PROJECT_SHOWCASE_ITEMS_PER_PAGE,
  );
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECT_SHOWCASE_ITEMS_PER_PAGE,
    currentPage * PROJECT_SHOWCASE_ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-screen bg-background">
      <section className="w-full">{/* Hero section content */}</section>
      <main className="container mx-auto px-4 py-12 md:px-6">
        <section>
          <div className="mb-8">
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {PROJECT_SHOWCASE_INDUSTRIES.map((industry) => (
                <Link
                  key={industry}
                  href={`/project-showcase?industry=${industry}&page=1`}
                  className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    selectedIndustry === industry
                      ? "bg-primary text-primary-foreground shadow hover:bg-primary/90"
                      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {industry}
                </Link>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/project-showcase/${project.slug}`}
                className="block"
              >
                <Card className="flex h-full cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg">
                  {/* <Image
                    src={project.image ?? "/assets/showcase/default_image.png"}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  /> */}
                  <CardHeader>
                    <CardTitle className="mb-3">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2">
                      {project.industries?.map((industry) => (
                        <Badge key={industry} variant="secondary">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center">
            <div className="mb-4 text-muted-foreground text-sm">
              Showing {paginatedProjects.length} of {filteredProjects.length}{" "}
              projects in{" "}
              {selectedIndustry === "All" ? "all categories" : selectedIndustry}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Link
                    href={`/project-showcase?industry=${selectedIndustry}&page=${
                      currentPage > 1 ? currentPage - 1 : 1
                    }`}
                    passHref
                    legacyBehavior
                  >
                    <PaginationPrevious
                      className={
                        currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                      }
                    />
                  </Link>
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem key={`page-${pageNumber}`}>
                      <Link
                        href={`/project-showcase?industry=${selectedIndustry}&page=${pageNumber}`}
                        passHref
                        legacyBehavior
                      >
                        <PaginationLink isActive={currentPage === pageNumber}>
                          {pageNumber}
                        </PaginationLink>
                      </Link>
                    </PaginationItem>
                  ),
                )}
                <PaginationItem>
                  <Link
                    href={`/project-showcase?industry=${selectedIndustry}&page=${
                      currentPage < totalPages ? currentPage + 1 : totalPages
                    }`}
                    passHref
                    legacyBehavior
                  >
                    <PaginationNext
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </Link>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </main>
    </div>
  );
}
