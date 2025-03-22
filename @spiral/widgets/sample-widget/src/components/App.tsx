import {IWebcastLikeMessage, useTikTokEvent} from "@spiral/widget";
import useLikeStore from "../hooks/like-store.ts";
import styles from './App.module.css';

function App() {
  const {likes, addLikes} = useLikeStore();

  /** Add to the like store **/
  const onLikeEvent = (event: IWebcastLikeMessage) => addLikes(event.likeCount);

  /** Register an event handler **/
  useTikTokEvent("WebcastLikeMessage", onLikeEvent);

  return (
      <div className={styles.App}>
        <h3 className={'text-3xl font-bold'}>Like-O-Meter</h3>
        <span className={'bg-white text-black text-center px-4 py-1 rounded-lg text-2xl font-bold'}>{likes} Like{likes === 1 ? '' : 's'}</span>
      </div>
  );

}

export default App;
