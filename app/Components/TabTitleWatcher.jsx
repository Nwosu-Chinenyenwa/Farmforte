"use client";
import { useEffect } from "react";

export default function TabTitleWatcher() {
  useEffect(() => {
    const defaultTitle = document.title;
    const hiddenTitle = " 📢 come back!";

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = hiddenTitle;
      } else {
        document.title = defaultTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = defaultTitle;
    };
  }, []);

  return null;
}
