import {IWebcastEvent, IWebcastEventName, WebcastEventPluginEvent} from "../types";
import {usePluginEvent} from "./use-plugin-event";


export type EventListener<T extends IWebcastEventName> = (event: IWebcastEvent<T>) => void | Promise<void>;


export function useTikTokEvent<T extends IWebcastEventName>(
    event: T,
    onEvent: EventListener<T>,
    dependencies: any[] = []
): void {

  const onWebcastEvent = async (pluginEvent: WebcastEventPluginEvent) => {

    if (pluginEvent.detail.type !== event) {
      return;
    }

    return onEvent(pluginEvent.detail.data as IWebcastEvent<T>);

  }

  usePluginEvent("webcast-event", onWebcastEvent, dependencies);

}
