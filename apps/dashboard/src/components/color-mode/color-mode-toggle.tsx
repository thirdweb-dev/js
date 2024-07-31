import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";
import { Button } from "../../@/components/ui/button";
import { SkeletonContainer } from "../../@/components/ui/skeleton";
import { useIsClientMounted } from "../ClientOnly/ClientOnly";

export const ColorModeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const clientMounted = useIsClientMounted();

  return (
    <SkeletonContainer
      loadedData={
        clientMounted
          ? theme === "light"
            ? "light"
            : ("dark" as const)
          : undefined
      }
      skeletonData={"light"}
      render={(v) => {
        return (
          <Button
            className="p-3 fade-in-0"
            variant="ghost"
            aria-label="toggle color"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {v === "dark" ? (
              <FiMoon className="size-5" />
            ) : (
              <FiSun className="size-5" />
            )}
          </Button>
        );
      }}
    />
  );
};
