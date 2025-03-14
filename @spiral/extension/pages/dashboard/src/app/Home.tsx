import {withErrorBoundary, withSuspense} from '@extension/shared';
import StreamLaunchForm from "@src/components/stream-launch-form";


const Home = () => {

  return (
      <div className={"text-lg w-[100%]"}>
        <StreamLaunchForm/>
      </div>
  );
};


export default withErrorBoundary(withSuspense(Home, <div> Loading ... </div>), <div> Error Occur </div>);
