import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useDashboardStorageUpload } from "@3rdweb-sdk/react/hooks/useDashboardStorageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { PINNED_FILES_QUERY_KEY_ROOT } from "app/(app)/team/[team_slug]/(team)/~/usage/storage/your-files";
import { FileInput } from "components/shared/FileInput";
import { UploadIcon } from "lucide-react";
import { toast } from "sonner";

export const IconUpload: React.FC<{ onUpload: (url: string) => void }> = ({
  onUpload,
}) => {
  const storageUpload = useDashboardStorageUpload();
  const queryClient = useQueryClient();

  const handleIconUpload = (file: File) => {
    // if file size is larger than 5000kB, show error
    if (file.size > 5000 * 1024) {
      toast.error("Icon image can not be larger than 5MB");
      return;
    }

    storageUpload.mutate([file], {
      onSuccess([uri]) {
        if (uri) {
          onUpload(uri);
        } else {
          toast.error("Something went wrong uploading icon");
        }
        // also refetch the files list
        queryClient.invalidateQueries({
          queryKey: [PINNED_FILES_QUERY_KEY_ROOT],
        });
      },
      onError(error) {
        console.error(error);
        toast.error("Failed to upload icon");
      },
    });
  };

  return (
    <FileInput
      setValue={handleIconUpload}
      accept={{ "image/*": [] }}
      className="flex items-center"
    >
      <Button
        variant="ghost"
        className="!h-auto gap-1.5 px-1 py-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
        size="sm"
      >
        Upload Icon
        {storageUpload.isPending ? (
          <Spinner className="size-3" />
        ) : (
          <UploadIcon className="size-3" />
        )}
      </Button>
    </FileInput>
  );
};
