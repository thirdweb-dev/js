"use client";

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
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  PROJECT_SHOWCASE_DATA,
  PROJECT_SHOWCASE_INDUSTRIES,
  PROJECT_SHOWCASE_ITEMS_PER_PAGE,
} from "../../lib/project-showcase-constants";

export default function ProjectShowcase() {
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
      <header className="px-4 py-12 text-center md:px-6">
        <h1 className="mb-4 font-bold text-4xl">built on thirdweb</h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted-foreground text-xl">
          Discover the latest web3 apps and games built on thirdweb.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="https://portal.thirdweb.com/">
              Start building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="https://thirdweb.com/contact-us">Contact Us</Link>
          </Button>
        </div>
      </header>
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
                    src={project.image || ""}
                    alt={project.title}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
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
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(i + 1);
                      }}
                      isActive={currentPage === i + 1}
                    >
                      {i + 1}
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
