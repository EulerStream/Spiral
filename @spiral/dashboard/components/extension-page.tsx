"use client";

import {useEffect, useState} from "react";

interface ExtensionPageProps {
   path: string;
}

export default function ExtensionPage({path}: ExtensionPageProps) {
  const [rawQuery, setRawQuery] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRawQuery(window.location.search);
    }
  }, [typeof window]); // Runs when the path changes

  const resolveHashPath = (hashUrl: string) => {
      const hashIndex = hashUrl.indexOf("#");
      if (hashIndex === -1) {
          return "";
      }

      const resolvedPath = hashUrl.substring(hashIndex + 1);
      if (resolvedPath === "/" || resolvedPath === "") {
          return "";
      }

      return "/" + resolvedPath;
  }

  const onWindowMessage = (message: MessageEvent) => {
    // Confirm origin is this page (i.e. the extension)
    if (message.origin !== window.location.origin) {
      return;
    }

    const messageData = message.data;
    if (messageData.type != "dashboard-page-change") {
      return;
    }

    // Convert the hash URL to a full URL
    const hashUrl = messageData.data.data.url;
    const resolvedPath = resolveHashPath(hashUrl);

    // Push a new state to the history, /dashboard/<path>
    window.history.pushState({}, "", `/dashboard${resolvedPath}`);

  }

  useEffect(() => {
    window.addEventListener("message", onWindowMessage);

    return () => {
      window.removeEventListener("message", onWindowMessage);
    }
  });

  return (
      <iframe
          className={'w-[100%] h-[100%] overflow-auto border-none min-h-[100svh]'}
          src={`chrome-extension://hnjdpacmiaiffedllfadkhmihehbijkd/dashboard/index.html#${path}${rawQuery}`}
      >
      </iframe>
  );
}
