import {useParams, useSearchParams} from "react-router";
import {LiveVideoEmbed} from "@src/components/live-video-embed-self";
import {getPath} from "@src/lib/utils";

export default function LiveKiosk() {
  const {uniqueId} = useParams();
  const [params, _] = useSearchParams();

  if (!uniqueId) {
    window.location.href = getPath('/tools/live-kiosk');
    return;
  }

  document.title = `Spiral | ${uniqueId}`
  document.body.style.backgroundColor = 'black';

  // Strip the @ from the username if it's there
  const uniqueIdStripped = uniqueId?.replace(/^@/, '');

  return (
      <div className={'w-[100svw] h-[100svh] bg-black text-white'}>
        <LiveVideoEmbed uniqueId={uniqueIdStripped} includeComments={params.get('comments') === '1'} className={'w-full h-full'}/>
      </div>
  )

}