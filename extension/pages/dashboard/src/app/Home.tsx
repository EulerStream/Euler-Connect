import {useStorage, withErrorBoundary, withSuspense} from "@extension/shared";
import {settingStorage} from "@extension/storage/lib";
import SectionHeader from "@src/components/ui/section-header";
import {CheckboxWithText} from "@src/components/ui/checkbox";
import {InputWithText} from "@src/components/ui/input";
import Logger from "@extension/shared/lib/logger";
import {Button} from "@src/components/ui/button";
import {ProxyEvent} from "@extension/message-proxy";
import {ProxyEventSource} from "@extension/message-proxy/lib/base-proxy";
import {getPath} from "@src/lib/utils";
import {useEffect, useState} from "react";

function OpenPopup(uniqueId: string) {
  window.open(
      getPath(`/popup/${uniqueId}?title=TikTok+Connection`),
      "popupWindow",
      "width=340,height=280,toolbar=no,location=no,menubar=no,scrollBars=no"
  );
}

const Home = () => {
  const settings = useStorage(settingStorage);
  if (!settings.sessionId) settingStorage.resetSessionId().then(() => Logger.info("Initialized Agent ID"));
  const [streamerValue, setStreamerValue] = useState("tv_asahi_news");

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
    if (searchParams.get('popup') === '1') {
      Logger.info("Opening popup...")
      OpenPopup('tv_asahi_news')
    }
  }, []);

  return (
      <div className={"text-lg"}>
        <section>
          <SectionHeader
              header={"Extension Information"}
              description={"Information about your client"}
          />
          <div
              className={
                "bg-accent-darker p-4 rounded-xl mt-4 max-w-fit min-w-[600px]"
              }
          >
            <InputWithText
                subtext={'Persistent Session Identifier for accessing stream data'}
                text={'Session Id'}
                value={settings.sessionId}
                readOnly={true}
                siblings={
                  <Button variant={'secondary'} onClick={async () => {
                    await settingStorage.resetSessionId();
                    document.__Background__.MessageProxy.emit(ProxyEvent.RESET_SESSION_ID, ProxyEventSource.CONTENT, {});
                  }}>
                    Reset Id
                  </Button>
                }
            />
          </div>
        </section>
        <hr className={'my-8'}/>
        <section>
          <SectionHeader
              header={"Extension Settings"}
              description={"Update settings intended for advanced users"}
          />

          <div
              className={
                "bg-accent-darker p-4 rounded-xl mt-4 max-w-fit min-w-[600px]"
              }
          >
            <CheckboxWithText
                checked={settings.customServerEnabled}
                onClick={async () => {
                  return settingStorage.updateSettings({customServerEnabled: !settings.customServerEnabled})
                }
                }
                text={"Custom Server"}
                subtext={"Set a custom WebSocket server to push TikTok events."}
            />

            {settings.customServerEnabled && (
                <InputWithText
                    containerProps={{className: "ml-6 mt-4"}}
                    text={"Server Url"}
                    subtext={"The URL the event Push Server is on."}
                    value={settings.customServerUrl}
                    onChange={(e) => settingStorage.updateSettings({customServerUrl: e.target.value})}
                />
            )}
          </div>
        </section>
        <hr className={'my-8'}/>
        <section>
          <SectionHeader
              header={"Launch Stream"}
              description={"Connect to a TikTok LIVE Stream"}
          />
          <div
              className={
                "bg-accent-darker p-4 rounded-xl mt-4 max-w-fit min-w-[600px]"
              }
          >

            <InputWithText
                text={'Connect to Streamer'}
                subtext={"Enter the user's username to begin"}
                value={streamerValue} onChange={(e) => setStreamerValue(e.target.value)}
                siblings={
                  <Button variant={'secondary'} onClick={() => {
                    OpenPopup(streamerValue)
                  }}>
                    Launch
                  </Button>
                }
            ></InputWithText>
          </div>

        </section>


      </div>
  );
};

export default withErrorBoundary(
    withSuspense(Home,
        <div> Loading ... </div>
    ),
    <div> Error Occur </div>
    ,
);
