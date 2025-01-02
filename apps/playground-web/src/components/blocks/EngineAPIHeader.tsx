import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";

export function EngineAPIHeader(props: {
  title: string;
  description: React.ReactNode;
  deployLink: string;
  docsLink: string;
  heroLink: string;
}) {
  return (
    <div
      className="mb-12 flex flex-col-reverse items-center justify-between gap-6 rounded-3xl px-6 py-8 lg:flex-row lg:px-14 lg:py-14"
      style={{
        background:
          "linear-gradient(to top, hsl(var(--secondary)/80%), transparent)",
      }}
    >
      {/* Left */}
      <div>
        <h1 className="mb-2 font-bold text-4xl tracking-tighter md:text-5xl">
          {props.title}
        </h1>
        <p className="mb-5 max-w-[700px] text-balance text-muted-foreground">
          {props.description}
        </p>

        <div className="flex flex-col gap-3 md:flex-row">
          <Button asChild size="lg">
            <Link target="_blank" href={props.deployLink}>
              Deploy an Instance
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link target="_blank" href={props.docsLink}>
              View docs
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link
              target="_blank"
              href="https://thirdweb.com/contact-us?utm_source=playground"
            >
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
        className="max-h-[300px] rounded-2xl object-contain lg:max-w-[500px]"
        alt=""
        priority={true}
      />
    </div>
  );
}
