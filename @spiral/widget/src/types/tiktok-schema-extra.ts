import * as tiktokSchema from './tiktok-schema';

export type _SchemaEvents = {
  [K in keyof typeof tiktokSchema]:
  typeof tiktokSchema[K] extends object ? K : never
}[keyof typeof tiktokSchema];

export type IWebcastEventName = Extract<_SchemaEvents, `Webcast${string}`>

export type IWebcastEvent<T extends IWebcastEventName> = ReturnType<typeof tiktokSchema[T]["fromJSON"]>;


