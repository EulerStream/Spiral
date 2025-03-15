import {createRoot} from 'react-dom/client';
import './styles/globals.css';
import {HashRouter as BrowserRouter, Route, Routes} from "react-router";
import Plugins from "@src/app/Plugins";
import NotFound from "@src/app/NotFound";
import Home from "@src/app/Home";
import PageLayout from "@src/layout";
import Settings from "@src/app/Settings";
import AutoModerator from "@src/app/tools/AutoModerator";
import LiveKioskForm from "@src/app/tools/kiosk/LiveKioskForm";
import LiveKiosk from "@src/app/tools/kiosk/LiveKiosk";
import Stream from "@src/app/Stream";
import {reportPageChange} from "@src/report-page-change";

const element = document.querySelector("#app-container")!;
const root = createRoot(element);
reportPageChange();

root.render(
    <BrowserRouter>
      <Routes>
        <Route
            path={"/"}
            element={
              <PageLayout
                  title={"Dashboard"}
                  description={"Euler Spiral Dashboard Home"} element={<Home/>}
              />}
        />
        <Route
            path={"/stream/:uniqueId"}
            element={
              <PageLayout
                  title={"Stream"}
                  description={"TikTok LIVE Stream"} element={<Stream/>}
              />}
        />
        <Route
            path={"/tools/live-kiosk/:uniqueId"}
            element={<LiveKiosk/>}
        />
        <Route
            path="/plugins"
            element={
              <PageLayout
                  title={"Plugins"}
                  description={"Manage your Spiral plugins"}
                  element={<Plugins/>}
              />
            }
        />
        <Route
            path="/settings"
            element={<PageLayout
                title={"Settings"}
                description={"Configure Spiral extension settings"}
                element={<Settings/>}
            />
            }
        />
        <Route
            path={"/tools/auto-moderator"}
            element={<PageLayout
                title={"Auto Moderator"}
                description={"Automatically moderate your chat"}
                element={<AutoModerator/>}
            />
            }
        />
        <Route
            path={"/tools/live-kiosk"}
            element={<PageLayout
                title={"Live Kiosk"}
                description={"Open a TikTok LIVE in kiosk mode"}
                element={<LiveKioskForm/>}
            />
            }
        />
        <Route
            path={"/tools/live-kiosk/:uniqueId"}
            element={<LiveKiosk/>}
        />
        <Route
            path={"*"}
            element={<PageLayout
                title={"Not Found"}
                description={"Page Not Found"}
                element={<NotFound/>}
            />
            }
        />
      </Routes>
    </BrowserRouter>
);

