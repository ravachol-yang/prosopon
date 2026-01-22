export const ENTRIES = {
  dashboard: { id: "/dashboard", title: "仪表盘" },
  overview: { id: "overview", title: "概览", parent: "dashboard" },
  profile: { id: "profile", title: "角色管理", parent: "dashboard" },
  closet: { id: "closet", title: "我的衣柜", parent: "dashboard" },
  genconfig: { id: "genconfig", title: "配置生成", parent: "dashboard" },

  explore: { id: "wild", title: "探索" },
  textures: { id: "textures", title: "材质列表", parent: "explore" },

  admin: { id: "admin", title: "管理员" },
  content: { id: "content", title: "内容管理", parent: "admin" },
  settings: { id: "settings", title: "网站设置", parent: "admin" },
};

export const SIDEBAR_ENTRIES = [
  {
    title: ENTRIES.overview.title,
    requireAdmin: false,
    entries: [ENTRIES.overview, ENTRIES.profile, ENTRIES.closet, ENTRIES.genconfig],
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
