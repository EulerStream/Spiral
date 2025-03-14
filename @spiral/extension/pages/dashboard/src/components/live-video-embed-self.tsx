import {useStorage} from "@extension/shared/lib/hooks";
import {tiktokDataStorage} from "@extension/storage/lib";
import {ComponentProps, useEffect, useRef, useState} from "react";
import {BackgroundMessageProxy, useMessageProxy} from "@extension/message-proxy/dist/lib";
import {cn} from "@src/lib/utils";


function PlaceholderVideo({loading}: { loading?: boolean }) {
  return (
      <div
          className={cn("w-[100%] h-[100%] rounded-sm bg-accent-darker text-3xl flex items-center justify-center", loading ? "animation-buffering" : "")}>
        {loading ? 'Loading Stream...' : 'Stream Unavailable'}
      </div>
  )
}

interface LiveVideoEmbedProps extends ComponentProps<"div"> {
  uniqueId: string
  includeComments?: boolean
}


export default function LiveVideoEmbedSelf({includeComments, ...props}: Omit<LiveVideoEmbedProps, 'uniqueId'>) {
  const {profile} = useStorage(tiktokDataStorage);
  let uniqueId = profile?.uniqueId;

  // todo modify to (A) separate the embed script stuff from the NORMAL runtime in the injected-script dir
  // and (2) Add comments but override the stylesheet to match spiral when the video is available
  if (!uniqueId) {
    return;
  }

  if (uniqueId === 'isaackogz') {
    uniqueId = 'tv_asahi_news'
  }

  return (
      <LiveVideoEmbed uniqueId={uniqueId} includeComments={includeComments} {...props}/>
  )

}


/**
 * Embed the profile page so that we can intercept the user's profile data
 */
export function LiveVideoEmbed({uniqueId, includeComments = true, ...props}: LiveVideoEmbedProps) {
  const [loadingState, setLoadingState] = useState<"loading" | "loaded" | "failed">("loading");
  const messageProxy = useMessageProxy(BackgroundMessageProxy);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    messageProxy.on('tiktok-embed-ready', () => {
      setLoadingState("loaded");
    });

    messageProxy.on('tiktok-embed-failed', () => {
      setLoadingState("failed");
    });

    setTimeout(() => {
      iframeRef.current!.src = iframeRef.current!.src;
    }, 1000)

  }, []);


  const {className, ...rest} = props;
  return (
      <div className={cn(className, "aspect-video rounded-sm")} {...rest}>

        <iframe
            ref={iframeRef}
            style={{display: loadingState === 'loaded' ? 'block' : 'none'}}
            className={"w-[100%] h-[100%] rounded-sm"}
            src={`https://www.tiktok.com/@${uniqueId}/live?spiral-embedded-stream-video=1&include-comments=${includeComments ? 1 : 0}`}
            allow="accelerometer; ambient-light-sensor; autoplay; battery; bluetooth; camera; ch-ua; ch-ua-arch; ch-ua-bitness; ch-ua-full-version; ch-ua-full-version-list; ch-ua-high-entropy-values; ch-ua-mobile; ch-ua-model; ch-ua-platform; ch-ua-platform-version; ch-ua-wow64; compute-pressure; cross-origin-isolated; direct-sockets; display-capture; encrypted-media; execution-while-not-rendered; execution-while-out-of-viewport; fullscreen; geolocation; gyroscope; hid; identity-credentials-get; idle-detection; keyboard-map; magnetometer; mediasession; microphone; midi; navigation-override; otp-credentials; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; serial; sync-xhr; storage-access; usb; web-share; window-management; xr-spatial-tracking">
        </iframe>

        {loadingState !== 'loaded' && (
            <PlaceholderVideo loading={loadingState === 'loading'}/>
        )}
      </div>
  )


}