import { spacing } from "../design-system";

// for rendering a space between elements
// use this component instead of margins to avoid embedding layout logic in components

export const Spacer: React.FC<{ y: keyof typeof spacing }> = ({ y }) => {
  return (
    <div
      style={{
        height: spacing[y],
      }}
    />
  );
};
