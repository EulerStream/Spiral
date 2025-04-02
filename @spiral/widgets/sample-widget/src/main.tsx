import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from "./components/App.tsx";
import {SpiralExtensionProvider} from "@spiral/widget";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <SpiralExtensionProvider>
        <App/>
      </SpiralExtensionProvider>
    </StrictMode>,
);
