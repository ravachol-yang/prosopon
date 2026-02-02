export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN!;
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Prosopon";
export const SESSION_PREFIX = process.env.SESSION_PREFIX || "prosopon";

export const TEXTURE_PREFIX = process.env.NEXT_PUBLIC_TEXTURE_PREFIX;

export const TEXTURE_DOMAIN = process.env.TEXTURE_DOMAIN;

export const TOKEN_HALF_LIFE = 6 * 60 * 60;

export const MAX_PROFILES = +(process.env.NEXT_PUBLIC_MAX_PROFILES || 3);

export const YGG_API_PREFIX = "https://" + SITE_DOMAIN + "/api/yggdrasil";

export const ENTRIES = {
  dashboard: { id: "/", title: "仪表盘" },
  overview: { id: "overview", title: "概览", url: "overview" },
  profile: { id: "profile", title: "角色管理", url: "profile" },
  closet: { id: "closet", title: "我的衣柜", url: "closet" },
  account: { id: "account", title: "我的账户", url: "account" },

  admin: { id: "admin", title: "管理员" },
  content: { id: "content", title: "内容管理", url: "admin/content" },
};

export const SIDEBAR_ENTRIES = [
  {
    title: ENTRIES.dashboard.title,
    requireAdmin: false,
    entries: [ENTRIES.overview, ENTRIES.profile, ENTRIES.closet, ENTRIES.account],
  },
  {
    title: ENTRIES.admin.title,
    requireAdmin: true,
    entries: [ENTRIES.content],
  },
];
