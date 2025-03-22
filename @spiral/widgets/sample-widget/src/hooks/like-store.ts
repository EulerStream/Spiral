import {create} from "zustand";

interface LikeStore {
  likes: number;
  addLikes: (count: number) => void;
}

const useLikeStore = create<LikeStore>((set) => ({
  likes: 0,
  addLikes: (count: number) =>
      set((state) => ({
        likes: state.likes + count,
      })),
}));

export default useLikeStore;
