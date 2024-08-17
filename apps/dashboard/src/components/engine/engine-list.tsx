import { Spinner } from "@/components/ui/Spinner/Spinner";
import { useEngineInstances } from "@3rdweb-sdk/react/hooks/useEngine";
import { useTrack } from "hooks/analytics/useTrack";
import {
  CloudDownloadIcon,
  ExternalLinkIcon,
  PlusIcon,
  RocketIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { UnorderedList } from "../../@/components/ui/List/List";
import { Button } from "../../@/components/ui/button";
import { EngineInstancesTable } from "./engine-instances-table";

export const EngineInstancesList = () => {
  const instancesQuery = useEngineInstances();
  const instances = instancesQuery.data ?? [];
  const trackEvent = useTrack();

  if (instancesQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <Spinner className="size-14" />
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <div className="max-w-[600px] mx-auto">
        <Image
          alt="Engine hero image"
          src={require("../../../public/assets/engine/empty-state-header.png")}
        />

        <div className="h-6" />

        <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
          Your scalable web3 backend server
        </h1>

        <div className="h-3" />

        <UnorderedList>
          <li>Read, write, and deploy contracts at production scale</li>
          <li>
            Reliably parallelize and retry transactions with gas & nonce
            management
          </li>
          <li>Securely manage backend wallets</li>
          <li>Built-in support for account abstraction, relayers, and more</li>
        </UnorderedList>

        <div className="h-6" />

        <div className="flex gap-3">
          <CreateEngineLink label="Get Started" />

          <Button
            asChild
            onClick={() => {
              trackEvent({
                category: "engine",
                action: "try-demo",
                label: "clicked-try-demo",
              });
            }}
            variant="outline"
          >
            <Link href={"/dashboard/engine/sandbox"} className="gap-2">
              Try Demo
              <RocketIcon className="size-4 text-muted-foreground" />
            </Link>
          </Button>
        </div>

        <div className="h-10" />

        <div className="flex items-center gap-4 justify-between rounded-lg border border-border p-6 bg-secondary">
          <p className="text-lg font-semibold tracking-tight">
            Already have an Engine Instance?
          </p>

          <ImportEngineLink label="Import" />
        </div>

        <div className="h-20" />
        <LearnMoreCard />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <h1 className="text-4xl font-bold">Engine</h1>
        <div className="flex flex-row gap-2">
          <ImportEngineLink label="Import" />
          <CreateEngineLink label="Create Engine Instance" />
        </div>
      </div>

      <div className="h-6" />

      <EngineInstancesTable
        instances={instances}
        isFetched={instancesQuery.isFetched}
        isLoading={instancesQuery.isLoading}
        refetch={instancesQuery.refetch}
      />

      <div className="h-10" />
      <LearnMoreCard />
    </div>
  );
};

function LearnMoreCard() {
  return (
    <div className="p-4 border border-border rounded-lg relative hover:bg-secondary">
      <h3 className="font-semibold tracking-tight mb-1">
        <Link
          href="https://portal.thirdweb.com/engine"
          target="_blank"
          className="before:content before:absolute before:inset-0"
        >
          Learn more about Engine
        </Link>
      </h3>

      <p className="text-muted-foreground text-sm">
        Dive into features and integration guides.
      </p>

      <ExternalLinkIcon className="size-4 text-muted-foreground absolute right-4 top-4" />
    </div>
  );
}

function CreateEngineLink(props: {
  label: string;
}) {
  const trackEvent = useTrack();

  return (
    <Button
      asChild
      variant="primary"
      onClick={() => {
        trackEvent({
          category: "engine",
          action: "click",
          label: "add-engine-instance",
        });
      }}
    >
      <Link href={"/dashboard/engine/create"} className="gap-2">
        <PlusIcon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
}

function ImportEngineLink(props: {
  label: string;
}) {
  const trackEvent = useTrack();

  return (
    <Button
      asChild
      variant="outline"
      onClick={() => {
        trackEvent({
          category: "engine",
          action: "import",
        });
      }}
    >
      <Link href={"/dashboard/engine/import"} className="gap-2">
        <CloudDownloadIcon className="size-4" />
        {props.label}
      </Link>
    </Button>
  );
}
