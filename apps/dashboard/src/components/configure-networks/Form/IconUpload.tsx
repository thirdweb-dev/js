import { Spinner } from "@/components/ui/Spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useDashboardStorageUpload } from "@3rdweb-sdk/react/hooks/useDashboardStorageUpload";
import { useQueryClient } from "@tanstack/react-query";
import { FileInput } from "components/shared/FileInput";
import { PINNED_FILES_QUERY_KEY_ROOT } from "components/storage/your-files";
import { FiUpload } from "react-icons/fi";
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
        onUpload(uri);
        // also refetch the files list
        queryClient.invalidateQueries([PINNED_FILES_QUERY_KEY_ROOT]);
      },
      onError(error) {
        console.error(error);
        toast.error("Failed to upload file");
      },
    });
  };

  return (
    <FileInput setValue={handleIconUpload} accept={{ "image/*": [] }}>
      <Button variant="ghost" className="gap-2 px-2" size="sm">
        {storageUpload.isLoading ? (
          <Spinner className="size-4" />
        ) : (
          <FiUpload className="size-4" />
        )}
        Upload Icon
      </Button>
    </FileInput>
  );
};
