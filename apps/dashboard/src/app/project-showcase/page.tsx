import { FileText } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../../@/components/ui/badge";
import { Button } from "../../@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../@/components/ui/pagination";
import { getThirdwebClient } from "../../@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "../../@/lib/resolveSchemeWithErrorHandler";
import {
  PROJECT_SHOWCASE_DATA,
  PROJECT_SHOWCASE_INDUSTRIES,
  PROJECT_SHOWCASE_ITEMS_PER_PAGE,
} from "../../lib/project-showcase-constants";
import { getAbsoluteUrl } from "../../lib/vercel-utils";

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

export default async function ProjectShowcasePage(props: {
  searchParams: Promise<{ industry?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
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
    <div className="min-h-dvh bg-background">
      <section className="w-full">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="font-bold text-3xl tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Built on thirdweb
                </h1>
                <p className="max-w-[600px] md:text-3xl">
                  Discover the latest web3 apps and games built on thirdweb.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link
                  href="https://thirdweb.com/login"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 font-medium text-gray-50 text-sm shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:focus-visible:ring-gray-300 dark:hover:bg-gray-50/90"
                >
                  Get Started
                </Link>
                <Link
                  href="https://blog.thirdweb.com/case-studies/"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 font-medium text-sm shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:focus-visible:ring-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                >
                  View all case studies
                </Link>
              </div>
            </div>
            <Image
              alt="Hero"
              className="mx-auto overflow-hidden object-cover object-center sm:w-full lg:order-last"
              height="550"
              src="/assets/showcase/abstract-w.png"
              width="550"
            />
          </div>
        </div>
      </section>
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
              <div key={project.id} className="block">
                <Card className="flex h-full cursor-pointer flex-col overflow-hidden transition-shadow hover:shadow-lg">
                  <Link
                    href={`/project-showcase/${project.slug}`}
                    className="flex-grow"
                  >
                    {/* eslint-disable @next/next/no-img-element */}
                    <img
                      src={
                        project.image?.startsWith("ipfs://")
                          ? (resolveSchemeWithErrorHandler({
                              client: getThirdwebClient(),
                              uri: project.image,
                            }) ?? "")
                          : (project.image ??
                            "/assets/showcase/default_image.png")
                      }
                      alt={project.title}
                      width={300}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                    <CardHeader>
                      <CardTitle className="mb-3">{project.title}</CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                  </Link>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {project.industries?.map((industry) => (
                          <Badge key={industry} variant="secondary">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                      {project.case_study && (
                        <Link
                          href={project.case_study}
                          target="_blank"
                          // onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> Case Study
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
