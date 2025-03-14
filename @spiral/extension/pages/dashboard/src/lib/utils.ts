import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPath(path: string) {
  let basePath = chrome.runtime.getURL("dashboard/index.html");
  if (path.startsWith("/")) {
    path = path.slice(1);
  }
  return basePath + "#" + path;
}

export function to(path: string) {
  window.location.href = getPath(path)
}


export function formatBytes(
    bytes: number,
    opts: {
      decimals?: number
      sizeType?: "accurate" | "normal"
    } = {}
) {
  const {decimals = 0, sizeType = "normal"} = opts

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"]
  if (bytes === 0) return "0 Byte"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
      sizeType === "accurate"
          ? (accurateSizes[i] ?? "Bytes")
          : (sizes[i] ?? "Bytes")
  }`
}
