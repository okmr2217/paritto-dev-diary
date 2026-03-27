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
  IDEA: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  DEVELOPING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  RELEASED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  MAINTENANCE: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  PAUSED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const CATEGORY_COLORS: Record<string, string> = {
  APP: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  MCP: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  SITE: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export const CATEGORY_PLACEHOLDER_COLORS: Record<string, string> = {
  APP: "bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-400",
  MCP: "bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400",
  SITE: "bg-cyan-100 text-cyan-500 dark:bg-cyan-900/30 dark:text-cyan-400",
};

export const RELEASE_TYPE_LABELS: Record<string, string> = {
  MAJOR: "メジャー",
  MINOR: "マイナー",
  PATCH: "パッチ",
  HOTFIX: "ホットフィックス",
};
