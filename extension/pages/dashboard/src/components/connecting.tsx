import {memo} from "react";
import {ConnectState} from "@extension/message-proxy";
import {CheckIcon} from "lucide-react";

interface FancyConnectionStatusProps {
  connectState: ConnectState;
  uniqueId: string
}

const FancyConnectionStatus = memo(
    ({connectState, uniqueId}: FancyConnectionStatusProps) => {
      const isConnected = connectState === ConnectState.CONNECTED;

      return (
          <div
              className="max-w-xs rounded-2xl">
            <div className="relative w-24 h-24 mx-auto">
              {isConnected ? (
                  <CheckIcon className={'h-full w-full scale-125 text-neutral-700'}/>
              ) : (
                  <div className="w-full h-full rounded-full border-8 border-neutral-700 animate-spin border-t-transparent"></div>
              )}
            </div>
            <div className="text-center mt-4">
              <h3 className="text-xl font-bold tracking-wide">
                {isConnected ? "Connected" : "Connecting..."}
              </h3>
              <p className="text-sm text-neutral-400 mt-1">
                {isConnected
                    ? `You are connected to @${uniqueId}!`
                    : `Connecting to @${uniqueId}...`}
              </p>
            </div>
          </div>
      );
    }
);

export default FancyConnectionStatus;