import { GridPattern } from "@/components/ui/background-patterns";

export function GridPatternEmbedContainer(props: {
  children: React.ReactNode;
}) {
  return (
    <div className=" sm:flex sm:justify-center w-full sm:border sm:border-dashed sm:bg-accent/20 sm:py-12 rounded-lg overflow-hidden relative">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray={"4 2"}
        className="text-border dark:text-border/70 hidden lg:block"
        style={{
          maskImage:
            "linear-gradient(to bottom right,white,transparent,transparent)",
        }}
      />
      <div className="sm:w-[420px] z-10">{props.children}</div>
    </div>
  );
}
