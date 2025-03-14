import {withErrorBoundary, withSuspense} from '@extension/shared';


const Home = () => {

  return (
      <div className={"text-lg w-[100%]"}>
      </div>
  );
};


export default withErrorBoundary(withSuspense(Home, <div> Loading ... </div>), <div> Error Occur </div>);
