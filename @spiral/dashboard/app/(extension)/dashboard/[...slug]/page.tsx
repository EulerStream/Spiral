"use client";

import {useParams} from "next/navigation";
import ExtensionPage from "@/components/extension-page";

export default function Page() {
  const { slug } = useParams();

  return (
      <ExtensionPage path={(slug as string[]).join("/")} />
  )

}