import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const SupportForm_TelegramInput = () => {
  const [telegramHandle, setTelegramHandle] = useState("");

  return (
    <div className="flex flex-col items-start gap-3">
      <Label className="text-white font-medium text-base" htmlFor="telegram">
        Telegram Handle
      </Label>{" "}
      <div className="w-full rounded-lg border border-[#1F1F1F] bg-[#0A0A0A] p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-600 p-2 flex items-center justify-center w-10 h-10">
            <span className="text-white text-lg font-bold">T</span>
          </div>
          <div className="flex flex-col flex-1">
            <span className="text-sm font-medium text-white">Telegram</span>
            <div className="flex items-center gap-1">
              <span className="text-[#737373] text-xs">@</span>
              <Input
                className="text-[#737373] text-xs bg-transparent border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-[#737373]"
                name="telegramHandle"
                onChange={(e) => setTelegramHandle(e.target.value)}
                placeholder="YourHandle"
                value={telegramHandle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
