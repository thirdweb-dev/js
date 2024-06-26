import { cn } from "@/lib/utils";
import type { Erc721 } from "@/types/erc721";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";

export default function NftCard({ data }: { data: Erc721 }) {
  console.log(data);
  return (
    <Link href="#">
      <div
        className={cn(
          "relative w-[300px] group h-[300px] border p-2 border-border rounded-md overflow-hidden transition-shadow shadow hover:shadow-md",
        )}
      >
        <Image
          src={data.image_url}
          alt={data.name}
          className="absolute inset-0 object-cover w-full h-full"
          width={500}
          height={500}
        />

        <div className="relative z-10 flex items-end w-full h-full justify-stretch">
          <div className="flex items-center justify-end w-full transition-all translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <Badge>
              {data.chainName.slice(0, 1).toUpperCase() +
                data.chainName.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
    </Link>
  );
}
