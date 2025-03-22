import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from "./components/App.tsx";
import ExtensionChannel from "../../../widget/src/components/extension-channel.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ExtensionChannel
          debugMode={true}
          width={600}
          height={300}
      >
        <App/>
      </ExtensionChannel>
    </StrictMode>,
);
