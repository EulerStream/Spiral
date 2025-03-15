"use client";

import {useEffect} from "react";

export function RedirectPage({url}: { url: string }) {

  useEffect(() => {
    window.location.href = url;
  });
  return <h1>Redirecting...</h1>
}