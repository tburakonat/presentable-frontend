import { useEffect, useRef } from "react";
import { useRouter } from "next/router";

export const useVideoTimestamp = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  useEffect(() => {
    const { t } = router.query;

    if (t && videoRef.current) {
      const timestamp = parseInt(t as string, 10);
      if (!isNaN(timestamp)) {
        videoRef.current.currentTime = timestamp;
      }
    }
  }, [router.query]);

  return videoRef;
};
