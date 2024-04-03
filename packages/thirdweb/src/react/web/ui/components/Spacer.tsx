import { spacing } from "../design-system/index.js";

/**
 * @internal
 */
export const Spacer: React.FC<{ y: keyof typeof spacing }> = ({ y }) => {
  return (
    <div
      style={{
        height: spacing[y],
      }}
    />
  );
};
