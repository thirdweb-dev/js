// UNCHANGED: MERGED FROM sdk-common-utilities/iframeMessages
export type MessageType<T> =
  | {
      eventType: string;
      success: true;
      data: T;
    }
  | {
      eventType: string;
      success: false;
      error: string;
    };
