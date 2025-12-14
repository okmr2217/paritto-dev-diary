---
title: "Next.js App Routerの基本"
date: "2024-12-13"
description: "Next.js 13から導入されたApp Routerの基本的な使い方を解説します。"
tags: ["Next.js", "React", "チュートリアル"]
---

## App Routerとは

Next.js 13から導入された新しいルーティングシステムです。`app` ディレクトリを使用し、React Server Componentsをデフォルトでサポートしています。

## ディレクトリ構造

```
app/
├── layout.tsx      # ルートレイアウト
├── page.tsx        # ホームページ (/)
├── about/
│   └── page.tsx    # Aboutページ (/about)
└── posts/
    └── [slug]/
        └── page.tsx # 動的ルート (/posts/xxx)
```

## Server Components

App Routerでは、コンポーネントはデフォルトでServer Componentとして扱われます。

```tsx
// Server Component（デフォルト）
export default async function Page() {
  const data = await fetchData(); // サーバーで実行
  return <div>{data.title}</div>;
}
```

クライアント側の機能が必要な場合は `"use client"` を指定します。

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

## まとめ

App Routerを使うことで、より効率的なWebアプリケーションを構築できます。
