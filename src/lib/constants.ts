export const SITE_DOMAIN = process.env.SITE_DOMAIN!;
export const SITE_NAME = process.env.SITE_NAME || "Prosopon";
export const SESSION_PREFIX = process.env.SESSION_PREFIX || "prosopon";

export const TEXTURE_PREFIX = process.env.NEXT_PUBLIC_TEXTURE_PREFIX;

export const TEXTURE_DOMAIN = process.env.TEXTURE_DOMAIN;

export const TOKEN_HALF_LIFE = 6 * 60 * 60;

export const ENTRIES = {
  dashboard: { id: "/dashboard", title: "仪表盘" },
  overview: { id: "overview", title: "概览", url: "overview" },
  profile: { id: "profile", title: "角色管理", url: "profile" },
  closet: { id: "closet", title: "我的衣柜", url: "closet" },
  account: { id: "account", title: "我的账户", url: "account" },
  genconfig: { id: "genconfig", title: "配置生成", url: "genconfig" },

  explore: { id: "wild", title: "探索" },
  textures: { id: "textures", title: "材质列表", url: "textures" },

  admin: { id: "admin", title: "管理员" },
  content: { id: "content", title: "内容管理", url: "admin/content" },
  settings: { id: "settings", title: "网站设置", url: "admin/settings" },
};

export const SIDEBAR_ENTRIES = [
  {
    title: ENTRIES.dashboard.title,
    requireAdmin: false,
    entries: [
      ENTRIES.overview,
      ENTRIES.profile,
      ENTRIES.closet,
      ENTRIES.account,
      ENTRIES.genconfig,
    ],
  },
  {
    title: ENTRIES.explore.title,
    requireAdmin: false,
    entries: [ENTRIES.textures],
  },
  {
    title: ENTRIES.admin.title,
    requireAdmin: true,
    entries: [ENTRIES.content, ENTRIES.settings],
  },
];
