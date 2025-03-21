import {EventEmitter} from "events";
import {IWebcastEvent, IWebcastEventName} from "../types/tiktok-schema-extra";
import {usePluginEvent} from "./plugin-event-hook";
import {WebcastEventPluginEvent} from "../types/plugin-events";
import {useEffect, useMemo} from 'react';


class WebcastHookEmitter extends EventEmitter {

  on<T extends IWebcastEventName>(event: T, listener: (event: IWebcastEvent<T>) => void): this {
    return super.on(event, listener);
  }

}


export function useWebcastEvents(): WebcastHookEmitter {
  const emitter = useMemo(() => new WebcastHookEmitter(), []);

  useEffect(() => {
    const onWebcastEvent = (event: WebcastEventPluginEvent) => {
      const {type, data} = event.detail;
      emitter.emit(type, data);
    };

    usePluginEvent('webcast-event', onWebcastEvent);
  }, [emitter]);

  return emitter;
}
