"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import Image from "next/image";
import Favicon from "/public/favicon-2.ico";

export function Logo(props: any) {

  const {theme} = useTheme();
  const [filter, setFilter] = useState<string>("");

  useEffect(() => {
    setFilter(theme === "light" ? "invert(1)" : "");
  }, [theme])

  return (
      <Image width={32} height={32} src={Favicon} style={{filter: filter}} alt={"Logo"} {...props} />
  )
}