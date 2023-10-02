export type WelcomeScreen =
  | {
      title?: string;
      subtitle?: string;
      img?: {
        src: string;
        width?: number;
        height?: number;
      };
    }
  | (() => React.ReactNode);
