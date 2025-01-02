import { Label } from "@/components/ui/label";

export const AttachmentForm = () => {
  return (
    <div className="flex flex-col items-start gap-2">
      <Label htmlFor="files" className="relative">
        Attachments
      </Label>
      <input
        type="file"
        multiple
        accept="image/*,video/*,"
        name="attachments"
      />
    </div>
  );
};
