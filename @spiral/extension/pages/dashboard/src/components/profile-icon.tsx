import {useStorage} from "@extension/shared/lib/hooks";
import {tiktokDataStorage} from "@extension/storage/lib";

export default function ProfileIcon() {
  const {profile} = useStorage(tiktokDataStorage);
  if (!profile?.uniqueId) {
    return null;
  }

  const avatarUri = profile.avatarUri[0];

  return (
      <a target={"_blank"} className={"flex justify-center gap-x-2 items-center hover:opacity-80"} href={`https://www.tiktok.com/@${profile.uniqueId}`}>
        <span className={"text-lg"}>@{profile.uniqueId}</span>
        {avatarUri &&
          <img alt={profile.uniqueId} className={"w-10 h-10 rounded-full inline-block ml-2"} src={avatarUri}/>
        }
      </a>
  )

}