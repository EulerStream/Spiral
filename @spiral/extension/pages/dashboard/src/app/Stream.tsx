import {withErrorBoundary, withSuspense} from '@extension/shared';
import {useParams, useSearchParams} from "react-router";
import {getPath} from "@src/lib/utils";
import WebRtcConnectionMonitor from "@src/components/rtc-connection";

const Stream = () => {
  const {uniqueId} = useParams();
  const [params, _] = useSearchParams();

  if (!uniqueId) {
    window.location.href = getPath('/');
    return;
  }

  const uniqueIdStripped = uniqueId?.replace(/^@/, '');
  document.title = `Spiral | ${uniqueId}`
  document.body.style.backgroundColor = 'black';
  return (
      <div className={"w-[100%] h-[100%] bg-black text-white"}>
        <WebRtcConnectionMonitor/>
        {/*
        <LiveVideoEmbed
            uniqueId={uniqueIdStripped}
            includeComments={params.get('comments') === '1'}
            className={'w-full h-full'}/>
            */}
      </div>
  );
};


export default withErrorBoundary(withSuspense(Stream, <div> Loading ... </div>), <div> Error Occur </div>);
