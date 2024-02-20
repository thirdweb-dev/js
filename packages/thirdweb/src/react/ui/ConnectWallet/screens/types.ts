/**
 * Render custom Welcome Screen in "wide" `ConnectButton`'s Modal either by passing a custom React component or by passing an object with custom title, subtitle and image
 * @example
 *
 * ### Custom React component
 * ```tsx
 * <ConnectButton
 *  welcomeScreen={() => <div style={{
 *    height: '100%',
 *  }}>
 *    ...
 *  </div>}
 * />
 * ```
 *
 * ### Custom title, subtitle and image
 * ```tsx
 * <ConnectButton
 *  welcomeScreen={{
 *    title: 'Custom Title',
 *    subtitle: 'Custom Subtitle',
 *    img: {
 *      src: 'https://example.com/image.png',
 *      width: 100,
 *      height: 100,
 *    }
 *  })
 * />
 * ```
 */
export type WelcomeScreen =
  | {
      /**
       * Custom title
       */
      title?: string;
      /**
       * Custom subtitle
       */
      subtitle?: string;
      /**
       * Custom image
       */
      img?: {
        /**
         * Image source
         */
        src: string;
        /**
         * Image width
         */
        width?: number;
        /**
         * Image height
         */
        height?: number;
      };
    }
  | (() => React.ReactNode);
