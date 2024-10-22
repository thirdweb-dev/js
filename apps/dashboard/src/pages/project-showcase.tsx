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
import { useState } from "react";
import {
  PROJECT_SHOWCASE_DATA,
  PROJECT_SHOWCASE_INDUSTRIES,
  PROJECT_SHOWCASE_ITEMS_PER_PAGE,
} from "../lib/project-showcase-constants";

export default function ProjectShowcase() {
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProjects =
    selectedIndustry === "All"
      ? PROJECT_SHOWCASE_DATA
      : PROJECT_SHOWCASE_DATA.filter(
          (project) => project.industry === selectedIndustry,
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
      <header className="py-12 px-4 md:px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">built on thirdweb</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Discover the latest web3 apps and games built on thirdweb.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg">
            Start building
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline">
            Contact Us
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-6 py-12">
        <section>
          <div className="mb-8">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProjects.map((project) => (
              <Card
                key={project.id}
                className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <Badge variant="secondary">{project.industry}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center">
            <div className="text-sm text-muted-foreground mb-4">
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
