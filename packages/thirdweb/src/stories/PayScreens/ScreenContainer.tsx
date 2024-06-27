import { PayEmbedContainer } from "../../react/web/ui/PayEmbed.js";
import { StoryScreenTitle } from "../utils.js";

export function ScreenContainer(props: {
  theme: "dark" | "light";
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div>
      <StoryScreenTitle label={props.label} />
      <PayEmbedContainer
        theme={props.theme}
        style={{
          maxWidth: "360px",
        }}
      >
        {props.children}
      </PayEmbedContainer>
    </div>
  );
}
