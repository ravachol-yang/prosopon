import { Boxes, Drama, Settings, Shirt, UserRound, File, Compass } from "lucide-react";

export const SIDEBAR_ENTRIES = [
  {
    title: "仪表盘",
    requireAdmin: false,
    entries: [
      {
        title: "概览",
        url: "",
        icon: Compass,
      },
      {
        title: "角色管理",
        url: "profile",
        icon: Drama,
      },
      {
        title: "我的衣柜",
        url: "closet",
        icon: Shirt,
      },
      {
        title: "我的账户",
        url: "account",
        icon: UserRound,
      },
    ],
  },
  {
    title: "广场",
    requireAdmin: false,
    entries: [
      {
        title: "材质列表",
        url: "#",
        icon: Boxes,
      },
      {
        title: "配置生成",
        url: "#",
        icon: File,
      },
    ],
  },
  {
    title: "管理员",
    requireAdmin: true,
    entries: [
      {
        title: "网站管理",
        url: "#",
        icon: Settings,
      },
    ],
  },
];
