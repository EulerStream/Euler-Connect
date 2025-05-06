import {FeatherIcon, HammerIcon, HomeIcon, Puzzle, SettingsIcon, TvIcon,} from "lucide-react";
import type {MenuGroup} from "@src/components/app-sidebar";

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
    },
  ],
};

const OverlayMenuGroup: MenuGroup = {
  title: "Overlays",
  icon: FeatherIcon,
  items: [],
};

const ToolsMenuGroup: MenuGroup = {
  title: "Tools",
  icon: FeatherIcon,
  items: [
    {
      title: "Auto Moderator",
      url: "/tools/auto-moderator",
      icon: HammerIcon,
    },
    {
      title: "Live Kiosk",
      url: "/tools/live-kiosk",
      icon: TvIcon,
    },
  ],
};

export function useSidebarContents(): MenuGroup[] {
  const baseQuickMenuGroup = {
    ...QuickMenuGroup,
    items: [...QuickMenuGroup.items],
  };

  return [baseQuickMenuGroup, OverlayMenuGroup, ToolsMenuGroup];
}
