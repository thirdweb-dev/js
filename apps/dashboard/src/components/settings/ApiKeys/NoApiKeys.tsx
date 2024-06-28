import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface NoApiKeysProps {
  copyOverride?: string;
  buttonTextOverride?: string;
  service: string;
}

export const NoApiKeys: React.FC<NoApiKeysProps> = ({
  service,
  copyOverride,
  buttonTextOverride,
}) => {
  return (
    <Card className="pt-4 pb-8">
      <div className="flex flex-col justify-center items-center gap-6">
        <Image
          src="/assets/tw-icons/keys.png"
          width={77}
          height={95}
          alt="no keys"
        />
        <div className="flex flex-col gap-4 items-center">
          <p>
            {copyOverride ??
              `You'll need to create an API Key to use ${service}.`}
          </p>
          <Button asChild variant="primary">
            <Link href="/dashboard/settings/api-keys">
              {buttonTextOverride ?? "Create API Key"}
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
