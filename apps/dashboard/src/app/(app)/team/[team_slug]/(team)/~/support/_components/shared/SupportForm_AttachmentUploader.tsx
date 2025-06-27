import { Label } from "@/components/ui/label";

export const AttachmentForm = () => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label
        className="relative text-base font-medium text-white"
        htmlFor="files"
      >
        Attachments
      </Label>
      <input
        accept="image/*,video/*,"
        className="text-sm text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#2663EB] file:text-white hover:file:bg-[#2663EB]/90 file:cursor-pointer cursor-pointer bg-[#0A0A0A] border border-[#1F1F1F] rounded-md p-2 hover:border-[#333333] focus:border-[#2663EB] w-full"
        multiple
        name="attachments"
        type="file"
      />
    </div>
  );
};
