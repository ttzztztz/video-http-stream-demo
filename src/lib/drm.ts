import { ReactEventHandler } from "react";

export const handleMediaEncryptedEvent: ReactEventHandler<HTMLVideoElement> = (
  e
) => {
  console.warn(e);
};
