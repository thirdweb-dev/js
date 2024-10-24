"use client";

import { AppFooter } from "@/components/blocks/app-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useThirdwebClient } from "@/constants/thirdweb.client";
import { resolveSchemeWithErrorHandler } from "@/lib/resolveSchemeWithErrorHandler";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThirdwebProvider } from "thirdweb/react";
import {
  PROJECT_SHOWCASE_DATA,
  PROJECT_SHOWCASE_INDUSTRIES,
  PROJECT_SHOWCASE_ITEMS_PER_PAGE,
} from "../../lib/project-showcase-constants";

export function ProjectShowcaseUI() {
  const thirdwebClient = useThirdwebClient();
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

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
                <Button
                  key={industry}
                  variant={
                    selectedIndustry === industry ? "default" : "outline"
                  }
                  onClick={() => {
                    setSelectedIndustry(industry);
                    setCurrentPage(1);
                  }}
                >
                  {industry}
                </Button>
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
                  <Image
                    src={
                      project.image?.startsWith("ipfs://")
                        ? (resolveSchemeWithErrorHandler({
                            client: thirdwebClient,
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
                  <PaginationPrevious
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={`page-${index + 1}`}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(index + 1);
                      }}
                      isActive={currentPage === index + 1}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ProjectShowcasePage() {
  return (
    <ThirdwebProvider>
      <ProjectShowcaseUI />
      <AppFooter />
    </ThirdwebProvider>
  );
}
