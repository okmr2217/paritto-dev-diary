export const STATUS_LABELS: Record<string, string> = {
  IDEA: "構想中",
  DEVELOPING: "開発中",
  RELEASED: "リリース済",
  MAINTENANCE: "メンテナンス",
  PAUSED: "休止中",
};

export const CATEGORY_LABELS: Record<string, string> = {
  APP: "アプリ",
  MCP: "MCP",
  SITE: "サイト",
};

export const STATUS_COLORS: Record<string, string> = {
  IDEA: "bg-slate-100 text-slate-700",
  DEVELOPING: "bg-blue-100 text-blue-700",
  RELEASED: "bg-green-100 text-green-700",
  MAINTENANCE: "bg-yellow-100 text-yellow-700",
  PAUSED: "bg-red-100 text-red-700",
};

export const CATEGORY_COLORS: Record<string, string> = {
  APP: "bg-purple-100 text-purple-700",
  MCP: "bg-orange-100 text-orange-700",
  SITE: "bg-cyan-100 text-cyan-700",
};

export const RELEASE_TYPE_LABELS: Record<string, string> = {
  MAJOR: "メジャー",
  MINOR: "マイナー",
  PATCH: "パッチ",
  HOTFIX: "ホットフィックス",
};
