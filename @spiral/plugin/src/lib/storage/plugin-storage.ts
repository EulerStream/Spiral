import {useEffect, useState} from "react";

export type ValueOrUpdate<D> = D | ((prev: D) => Promise<D> | D);

export type PluginStorage<D> = {
  get: () => Promise<D>;
  set: (value: ValueOrUpdate<D>) => Promise<void>;
  subscribe: (listener: (value: D) => void | Promise<void>) => () => void;
};

type PluginStorageStateUpdateReceived<D> = {
  type: "plugin-storage-state-update";
  storageKey: string;
  value: D;
}


type GetPluginStorageState = {
  type: "plugin-storage-state-get"
  storageKey: string;
}


type SetPluginStorageState = {
  type: "plugin-storage-state-set";
  storageKey: string;
  value: any;
}

export const updateListener = new EventTarget();

/** Forward state changes from the content script to the respective listener **/
window.addEventListener('message', (event: MessageEvent<PluginStorageStateUpdateReceived<any>>) => {
  if (event.source !== window) {
    return;
  }

  if (event.data?.type !== 'plugin-storage-state-update') {
    return;
  }

  updateListener.dispatchEvent(new CustomEvent(event.data.storageKey, {detail: event.data.value}));
});


/** Create a plugin storage instance **/
export function createPluginStorage<D>(
    storageKey: string,
    fallback: D
): PluginStorage<D> {

  const get = async (): Promise<D> => {
    return await new Promise<D>((resolve) => {

      // Send a request to the content script to get the storage state
      const request: GetPluginStorageState = {storageKey, type: "plugin-storage-state-get"};
      window.postMessage(request, '*');

      // Listen for the response from the content script
      updateListener.addEventListener(storageKey, (event: Event) => {
        if (!event) {
          resolve(fallback);
          return;
        }

        resolve((event as CustomEvent).detail);
      }, {once: true});
    });
  }

  const set = async (valueOrUpdate: ValueOrUpdate<D>): Promise<void> => {

    if (typeof valueOrUpdate === 'function') {
      const value = await get();
      valueOrUpdate = await (valueOrUpdate as CallableFunction)(value);
      return set(valueOrUpdate);
    }

    const value = typeof valueOrUpdate === 'function' ? await valueOrUpdate(await get()) : valueOrUpdate;
    const request: SetPluginStorageState = {storageKey, type: "plugin-storage-state-set", value};
    window.postMessage(request, '*');

  }

  const subscribe = (listener: (value: D) => void | Promise<void>) => {
    const onSubScribeUpdate = (event: Event): Promise<void> | void => listener((event as CustomEvent).detail);
    updateListener.addEventListener(storageKey, onSubScribeUpdate);
    return () => updateListener.removeEventListener(storageKey, onSubScribeUpdate);
  };

  return {get, set, subscribe};
}

/** React hook for using plugin storage within UI **/
export function usePluginStorage<D>(storage: PluginStorage<D>): D | undefined {
  const [state, setState] = useState<D | undefined>(undefined);

  useEffect(() => {
    const listener = storage.subscribe(setState);
    storage.get().then(setState);
    return () => listener();
  }, [storage]);

  return state;

}





