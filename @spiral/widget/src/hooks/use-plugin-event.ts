import {PluginEventType, SpecificPluginEvent} from "../types/plugin-events";
import {useEffect} from "react";

/**
 * A hook to listen for plugin events from the content script.
 * @param eventName The name of the event to listen for.
 * @param callback The callback function to execute when the event is received.
 * @param dependencies Dependencies
 * @returns A function to remove the event listener.
 */
export function usePluginEvent<
    P extends PluginEventType,
    E extends SpecificPluginEvent<P>
>(
    eventName: P,
    callback: (event: E) => void | Promise<void>,
    dependencies: any[] = []
): void {

  /** Handle the plugin message **/
  const onWindowMessage = async (event: MessageEvent<E>): Promise<void> => {
    if (event.data.type === eventName) {
      return callback(event.data);
    }
  };

  useEffect(() => {
    window.addEventListener('message', onWindowMessage);
    return () => window.removeEventListener('message', onWindowMessage);
  }, dependencies);

}