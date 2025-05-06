import {useEffect, useMemo} from "react";
import {BaseMessageProxy} from "./base-proxy";

export function useMessageProxy<T extends BaseMessageProxy>(MessageProxy: new () => T): T {
  const instance = useMemo(() => new MessageProxy(), [MessageProxy]);

  useEffect(() => {
    return () => instance.onUnmount();
  }, [instance]);

  return instance;
}
