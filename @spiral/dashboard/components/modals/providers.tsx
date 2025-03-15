"use client";

import { createContext, Dispatch, ReactNode, SetStateAction } from "react";

export const ModalContext = createContext<{
  setShowSignInModal: Dispatch<SetStateAction<boolean>>;
}>({
  setShowSignInModal: () => {},
});

export default function ModalProvider({ children }: { children: ReactNode }) {

  /*
  <ModalContext.Provider
      value={undefined}
    >
      {children}
    </ModalContext.Provider>
   */
  return (
    <div/>
  );
}
