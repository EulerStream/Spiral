import {BanIcon, FeatherIcon, HammerIcon, HomeIcon, Puzzle, SettingsIcon, TvIcon} from "lucide-react";
import {MenuGroup} from "@src/components/app-sidebar";
import {useStorage} from "@extension/shared";
import {tiktokDataStorage} from "@extension/storage/lib/impl/tiktokDataStorage";
import TikTokIcon from "@src/components/icons/tiktok-icon";

const QuickMenuGroup: MenuGroup = {
  title: "Main Menu",
  icon: FeatherIcon,
  items: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Plugins",
      url: "/plugins",
      icon: Puzzle,
    }, // todo add one that goes to the user's tiktok page (whatever their current user is, using cookies)
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    }
  ]
}

const OverlayMenuGroup: MenuGroup = {
  title: "Overlays",
  icon: FeatherIcon,
  items: []
}

const ToolsMenuGroup: MenuGroup = {
  title: "Tools",
  icon: FeatherIcon,
  items: [
    {
      title: "Auto Moderator",
      url: "/tools/auto-moderator",
      icon: HammerIcon
    },
    {
      title: "Live Kiosk",
      url: "/tools/live-kiosk",
      icon: TvIcon
    }
  ]
}


export function useSidebarContents(): MenuGroup[] {
  const baseQuickMenuGroup = {...QuickMenuGroup, items: [...QuickMenuGroup.items]};
  const {profile} = useStorage(tiktokDataStorage);

  if (profile?.uniqueId) {
    baseQuickMenuGroup.items.push(
        {
          title: `My TikTok LIVE`,
          url: `https://www.tiktok.com/@${profile.uniqueId}/live`,
          icon: TikTokIcon,
        }
    )
  }

  return [baseQuickMenuGroup, OverlayMenuGroup, ToolsMenuGroup]
}
