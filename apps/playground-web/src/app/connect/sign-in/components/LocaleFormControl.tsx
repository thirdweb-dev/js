import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LocaleId } from "thirdweb/react";
import type { ConnectPlaygroundOptions } from "./types";

const locales: {
  name: string;
  id: LocaleId;
}[] = [
  {
    name: "English",
    id: "en_US",
  },
  {
    name: "Spanish",
    id: "es_ES",
  },
  {
    name: "Japanese",
    id: "ja_JP",
  },
  {
    name: "Korean",
    id: "ko_KR",
  },
  {
    name: "Filipino",
    id: "tl_PH",
  },
  {
    name: "Vietnamese",
    id: "vi_VN",
  },
  {
    name: "German",
    id: "de_DE",
  },
  {
    name: "French",
    id: "fr_FR",
  },
];

export function LocaleFormControl(props: {
  connectOptions: ConnectPlaygroundOptions;
  setConnectOptions: React.Dispatch<
    React.SetStateAction<ConnectPlaygroundOptions>
  >;
}) {
  const { connectOptions, setConnectOptions } = props;
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="modal-locale">Locale</Label>
      <Select
        value={connectOptions.localeId}
        onValueChange={(v) => {
          const locale = locales.find((locale) => locale.id === v);
          if (!locale) return;
          setConnectOptions((v) => ({ ...v, localeId: locale.id }));
        }}
      >
        <SelectTrigger id="modal-locale">
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
