import {useStorage, withErrorBoundary, withSuspense} from '@extension/shared';
import {settingStorage} from "@extension/storage";
import SectionHeader from "@src/components/ui/section-header";
import {CheckboxWithText} from "@src/components/ui/checkbox";
import {InputWithText} from "@src/components/ui/input";
import Logger from "@extension/shared/lib/logger";
import {Button} from "@src/components/ui/button";


function uuid4(): string {
  return "spiral-" + "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
  );
}

const ResetAgentId = async () => {
  Logger.info('Generated new agent ID!');
  await settingStorage.updateSettings({agentId: uuid4()});
}

const Settings = () => {
  const settings = useStorage(settingStorage);

  if (!settings.agentId) {
    ResetAgentId().then(() => Logger.info("Initialized Agent ID"))
  }

  return (
      <div className={"text-lg"}>
        <section>
          <SectionHeader header={"Developer Settings"} description={"Update settings intended for advanced users"}/>

          <div className={"bg-accent-darker p-4 rounded-xl mt-4 max-w-fit min-w-[600px]"}>
            <CheckboxWithText
                checked={settings.agentEnabled}
                onClick={async () => settingStorage.updateSettings({agentEnabled: !settings.agentEnabled})}
                text={"Enable Spiral Agent"}
                subtext={"Enable usage of Spiral as a TikTokLive Signing Agent."}
            />

            {
              settings.agentEnabled && (
                    <InputWithText
                        containerProps={{className: "ml-6 mt-4"}}
                        text={"Agent Id"}
                        subtext={"The Agent Id to use when connecting via TikTokLive."}
                        value={settings.agentId}
                        readOnly={true}
                        siblings={
                          <Button
                              variant={"secondary"}
                              onClick={ResetAgentId}
                          >
                            Reset
                          </Button>
                        }
                    />
                )
            }
          </div>
        </section>

      </div>
  );

};


export default withErrorBoundary(withSuspense(Settings, <div> Loading ... </div>), <div> Error Occur </div>);
