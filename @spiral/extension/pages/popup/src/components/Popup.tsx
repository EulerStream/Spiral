import {withErrorBoundary, withSuspense} from '@extension/shared';
import SpiralLogo from '../assets/SpiralLogo.png';


const Popup = () => {
  const versionId = chrome.runtime.getManifest().version;

  return (
      <div className={`p-4 w-[340px] pb-5 bg-black text-white`}>
        <header className={"flex items-center gap-x-3"}>
          <img alt={"Logo"} src={SpiralLogo} className={"h-[40px] font-bold"}/>
          <h2 className={"font-bold text-lg"}>Euler Spiral <span
              className={"text-base text-gray-500"}>v{versionId}</span></h2>
        </header>
        Test
      </div>
  );
};


export default withErrorBoundary(withSuspense(Popup, <div> Loading ... </div>), <div> Error Occur </div>);
