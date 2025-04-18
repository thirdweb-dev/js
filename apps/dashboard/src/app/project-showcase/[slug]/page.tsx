import { ExternalLink, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../../@/components/ui/badge";
import { Button } from "../../../@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { getThirdwebClient } from "../../../@/constants/thirdweb.server";
import { resolveSchemeWithErrorHandler } from "../../../@/lib/resolveSchemeWithErrorHandler";
import { PROJECT_SHOWCASE_DATA } from "../../../lib/project-showcase-constants";

export default async function DetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;

  const project = PROJECT_SHOWCASE_DATA.find((p) => p.slug === slug);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 md:pr-6">
            <CardHeader className="border-b md:border-b-0">
              <CardTitle className="font-bold text-2xl md:text-3xl">
                {project.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="mb-4 text-lg">{project.description}</p>
              <div className="mb-6 flex flex-wrap gap-2">
                {project.industries.map((industry) => (
                  <Badge key={industry} variant="secondary">
                    {industry}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 sm:flex-row">
              <Button asChild className="w-full sm:w-auto">
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Project Website
                </Link>
              </Button>
              {project.case_study && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link
                    href={project.case_study}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Link to Case Study
                  </Link>
                </Button>
              )}
            </CardFooter>
          </div>
          <div className="md:w-1/2">
            <div className="relative aspect-video h-full w-full md:aspect-square">
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={
                  project.image?.startsWith("ipfs://")
                    ? (resolveSchemeWithErrorHandler({
                        client: getThirdwebClient(undefined),
                        uri: project.image,
                      }) ?? "")
                    : (project.image ?? "/assets/showcase/default_image.png")
                }
                alt={`${project.title} Thumbnail`}
                width={500}
                height={500}
                className="rounded-b-lg object-cover md:rounded-r-lg md:rounded-bl-none"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
