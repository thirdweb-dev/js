import { PayEmbedContainer } from "../../react/web/ui/PayEmbed.js";

export function ScreenContainer(props: {
  theme: "dark" | "light";
  children: React.ReactNode;
}) {
  return (
    <PayEmbedContainer
      theme={props.theme}
      style={{
        maxWidth: "360px",
      }}
    >
      {props.children}
    </PayEmbedContainer>
  );
}
