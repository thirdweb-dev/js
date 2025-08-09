import { useId } from "react";
import type { LocaleId } from "thirdweb/react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ConnectPlaygroundOptions } from "./types";

const locales: {
  name: string;
  id: LocaleId;
}[] = [
  {
    id: "en_US",
    name: "English",
  },
  {
    id: "es_ES",
    name: "Spanish",
  },
  {
    id: "ja_JP",
    name: "Japanese",
  },
  {
    id: "ko_KR",
    name: "Korean",
  },
  {
    id: "tl_PH",
    name: "Filipino",
  },
  {
    id: "vi_VN",
    name: "Vietnamese",
  },
  {
    id: "de_DE",
    name: "German",
  },
  {
    id: "fr_FR",
    name: "French",
  },
  {
    id: "zh_CN",
    name: "Chinese (Simplified)",
  },
];

export function LocaleFormControl(props: {
  connectOptions: ConnectPlaygroundOptions;
  setConnectOptions: React.Dispatch<
    React.SetStateAction<ConnectPlaygroundOptions>
  >;
}) {
  const { connectOptions, setConnectOptions } = props;
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Locale</Label>
      <Select
        onValueChange={(v) => {
          const locale = locales.find((locale) => locale.id === v);
          if (!locale) return;
          setConnectOptions((v) => ({ ...v, localeId: locale.id }));
        }}
        value={connectOptions.localeId}
      >
        <SelectTrigger id={id}>
          <SelectValue placeholder="English" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {locales.map((locale) => (
              <SelectItem key={locale.id} value={locale.id}>
                {locale.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
