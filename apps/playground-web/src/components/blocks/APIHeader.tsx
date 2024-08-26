import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function APIHeader(props: {
  title: string;
  description: React.ReactNode;
  docsLink: string;
  heroLink: string;
}) {
  return (
    <div
      className="flex flex-col-reverse lg:flex-row gap-6 items-center justify-between py-8 lg:py-14 mb-12 px-6 lg:px-14 rounded-3xl"
      style={{
        background:
          "linear-gradient(to top, hsl(var(--secondary)/80%), transparent)",
      }}
    >
      {/* Left */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2">
          {props.title}
        </h1>
        <p className="max-w-[700px] text-muted-foreground mb-5 text-balance">
          {props.description}
        </p>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button asChild size="lg">
            <Link target="_blank" href={props.docsLink}>
              View docs
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link target="_blank" href="https://thirdweb.com/contact-us">
              Book a Demo
            </Link>
          </Button>
        </div>
      </div>

      {/* Right */}
      <Image
        src={props.heroLink}
        width={600}
        height={400}
        className="lg:max-w-[500px] rounded-2xl max-h-[300px] object-contain"
        alt=""
        priority={true}
      />
    </div>
  );
}
