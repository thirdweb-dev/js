import { Label } from "@/components/ui/label";

export const AttachmentForm = () => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label className="relative" htmlFor="files">
        Attachments
      </Label>
      <input
        accept="image/*,video/*,"
        multiple
        name="attachments"
        type="file"
      />
    </div>
  );
};
