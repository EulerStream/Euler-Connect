import {withErrorBoundary, withSuspense} from "@extension/shared";
import {useParams} from "react-router";
import React, {useEffect, useState} from "react";
import {ConnectState, ProxyEvent} from "@extension/message-proxy";
import {ProxyMessagePacket} from "@extension/message-proxy/lib/base-proxy";
import FancyConnectionStatus from "@src/components/connecting";
import {ThemeProvider} from "@src/components/theme-provider";

declare global {
  interface Window {
    POPUP_DEBUG_ENABLED?: boolean;
    toggleDebug: () => void;
  }
}

function addToggleOpen() {
  window.POPUP_DEBUG_ENABLED = false;
  window.toggleDebug = () => {
    window.POPUP_DEBUG_ENABLED = !window.POPUP_DEBUG_ENABLED;
    const iframe = document.getElementById('tiktok')!;
    if (window.POPUP_DEBUG_ENABLED) {
      iframe.classList.remove('hidden')
    } else {
      iframe.classList.add('hidden')
    }
  }

}

type Theme = "system" | "dark" | "light";
const themes = ["system", "dark", "light"]
const DefaultTheme: Theme = "dark";

const Popup = () => {
  const {uniqueId} = useParams();
  if (!uniqueId) window.close();
  const [connectState, setConnectState] = useState<ConnectState>(ConnectState.CONNECTING);
  const [theme, setTheme] = useState<"system" | "dark" | "light">(DefaultTheme);

  const onConnectStateUpdate = (event: ProxyMessagePacket<ConnectState>) => setConnectState(event.data);

  // Set up the page
  useEffect(() => {
    document.__Background__.MessageProxy.on(ProxyEvent.CONNECT_STATE, onConnectStateUpdate);

    const searchParams = new URL(window.location.hash.substring(1), 'http://127.0.0.1').searchParams;
    document.title = searchParams.get("title") ?? document.title;
    let theme = searchParams.get("theme") ?? DefaultTheme;
    if (!themes?.includes(theme)) theme = DefaultTheme
    setTheme(theme as Theme);
    addToggleOpen();
  }, []);

  return (
      <ThemeProvider defaultTheme={theme} storageKey="vite-ui-theme">
        <div className={"bg-background w-screen h-screen flex justify-center items-center"}>
          <iframe
              id={'tiktok'}
              allow={'accelerometer; gyroscope;'}
              src={`https://www.tiktok.com/@${uniqueId}/live`}
              className={'hidden w-screen h-screen'}/>
          <FancyConnectionStatus connectState={connectState} uniqueId={uniqueId!}/>
        </div>
      </ThemeProvider>
  );
};

export default withErrorBoundary(
    withSuspense(Popup,
        <div> Loading ... </div>
    ),
    <div> Error Occur </div>
);
