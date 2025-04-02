import {withErrorBoundary, withSuspense} from '@extension/shared';
import {useParams} from "react-router";
import {getPath} from "@src/lib/utils";
import React from "react";
import {LiveVideoEmbed} from "@src/components/live-video-embed-self";
import {ExtensionConnectionProvider} from "@src/components/extension-channel";

const Stream = () => {
  const {uniqueId} = useParams();

  if (!uniqueId) {
    window.location.href = getPath('/');
    return;
  }

  document.title = `Spiral | ${uniqueId}`
  document.body.style.backgroundColor = 'black';

  return (
      <div className={"w-[100%] h-[100%] bg-black text-white"}>
        <ExtensionConnectionProvider debugMode={true}>
          <LiveVideoEmbed
              uniqueId={uniqueId}
              includeComments={true}
              className={'w-full h-full'}
          />
        </ExtensionConnectionProvider>
      </div>
  );
};


export default withErrorBoundary(withSuspense(Stream, <div> Loading ... </div>), <div> Error Occur </div>);
