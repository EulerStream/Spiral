import {IWebcastEvent, IWebcastEventName} from "./tiktok-schema-extra";

type BasePluginEvent = { type: string, detail: unknown }

export type WebcastEventPluginEvent = BasePluginEvent & {
  type: "webcast-event"
  detail: {
    type: IWebcastEventName;
    data: IWebcastEvent<IWebcastEventName>;
  }
}


export type ControlPluginEvent = BasePluginEvent & {
  type: "control-event"
  detail: "start" | "stop"
}

export type PluginEvent = WebcastEventPluginEvent | ControlPluginEvent;
export type PluginEventType = PluginEvent['type'];
export type SpecificPluginEvent<T extends PluginEventType> = Extract<PluginEvent, { type: T }>;

