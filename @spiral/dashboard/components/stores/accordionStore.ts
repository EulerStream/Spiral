"use client";

import {create} from "zustand";

interface AccordionStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useAccordionStore = create<AccordionStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({open})
}));