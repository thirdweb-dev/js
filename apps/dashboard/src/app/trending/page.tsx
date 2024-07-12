import type { Metadata } from "next";
import type { SortBy, TimeRange } from "../../lib/search";
import { TrendingContractSection } from "./components/trending-table";

export const metadata: Metadata = {
  title: "🔥 HOT Contracts",
  description: "See what's hot onchain right now",
  openGraph: {
    title: "🔥 HOT Contracts",
    description: "See what's hot onchain right now",
  },
};

export default async function DashboardContractTrendingPage(props: {
  searchParams: { timeRange?: TimeRange; page?: number; sortBy?: SortBy };
}) {
  return (
    <div>
      <div
        className="fixed bottom-0 w-full -z-10"
        style={{ backgroundColor: "#0E0E0E" }}
      >
        <video className="w-full object-center" autoPlay muted loop>
          <source src="/assets/trending/fire.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="container px-0 flex flex-col gap-8 py-6">
        <div className="flex flex-col gap-6 justify-between items-start">
          <div className="w-full flex flex-row justify-center items-center gap-4 mt-8">
            <h1 className="text-5xl md:text-7xl tracking-tight font-bold font-mono mb-2">
              🔥
            </h1>
            <div className="text-left">
              <h1 className="text-3xl md:text-5xl tracking-tight font-bold font-mono mb-2">
                HOT Contracts
              </h1>
              <p className="text-sm md:text-base text-secondary-foreground leading-7 w-full font-mono">
                See what's hot onchain right now
              </p>
            </div>
          </div>
          <div className="flex my-8 mx-4 gap-8 w-full">
            <TrendingContractSection
              timeRange={props.searchParams.timeRange}
              page={props.searchParams.page}
              sortBy={props.searchParams.sortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
