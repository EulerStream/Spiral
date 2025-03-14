import {useEffect} from 'react';
import SpiralLogo from './assets/SpiralLogo.png';
import Logger from "@extension/shared/dist/lib/logger";
import {useStorage} from "@extension/shared/dist/lib/hooks";
import {activeStorage, settingStorage, tiktokDataStorage} from "@extension/storage/dist/lib";
import {TikTokButton} from "@src/ui/TikTokButton";


export default function App() {
  const activeState = useStorage(activeStorage);
  const {ttwid} = useStorage(tiktokDataStorage)
  const {agentId, agentEnabled} = useStorage(settingStorage);
  const isActive = activeStorage.toBoolean(activeState);

  useEffect(() => {
    Logger.info('Spiral UI Mounted');
  }, []);

  useEffect(() => {
    const root = document.getElementById('spiral')!;
    root.setAttribute('spiral-ttwid', ttwid);
  }, [ttwid]);

  useEffect(() => {
    const root = document.getElementById('spiral')!;
    root.setAttribute('spiral-active', Number(isActive).toString());
    document.addEventListener('keydown', onKeydown);
    return () => document.removeEventListener('keydown', onKeydown);
  }, [isActive]);

  useEffect(() => {
    const root = document.getElementById('spiral')!;
    root.setAttribute('spiral-client-id', agentId);
  }, [agentId]);

  const onToggleActive = async () => {
    const newState = await activeStorage.toggle();
    Logger.info(`Toggled Spiral state to ${newState}!`);
  }

  const onKeydown = async (e: KeyboardEvent) => {
    if ((e.key === 'a' && !isActive) || (e.key === 'd' && isActive)) {
      await onToggleActive();
    }
  }

  return (
      <div className="h-[100%] flex justify-between px-2"
           style={{
             background: "rgb(18, 18, 18)",
             borderBottom: "1px solid rgba(255, 255, 255, 0.12)"
           }}
      >
        <div className={"flex items-center gap-x-3"}>
          <img src={SpiralLogo} className={"h-[90%] font-bold"}/>
          <h2 className={"font-bold text-xl ml-0"}>Euler Spiral</h2>
          <h3>Creator Tools for TikTok LIVE</h3>
        </div>
        <div className={"flex items-center gap-x-3"}>
          <TikTokButton variant={"secondary"}
            onClick={() => window.open(chrome.runtime.getURL('dashboard/index.html'))}
          >
            Dashboard
          </TikTokButton>
          {
            agentEnabled && (
                  <TikTokButton
                      onClick={onToggleActive}
                      className={"flex justify-center items-center"}
                      style={{background: isActive ? "rgb(255, 59, 92)" : "rgba(118,118,118,0.7)"}}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                    <span
                        className={"ml-1 p-1 rounded-sm font-bold text-center"}
                        style={
                          {
                            display: 'inline-block',
                            backgroundColor: "rgb(255, 255, 255)",
                            height: "20px",
                            width: "20px",
                            lineHeight: "12px",
                            color: "rgba(50, 52, 66, 0.8)",
                          }
                        }
                    >
              {isActive ? 'D' : 'A'}
            </span>
                  </TikTokButton>
              )
          }

        </div>
      </div>
  );
}
