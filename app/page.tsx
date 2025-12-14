export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">記事一覧</h1>
      <p className="text-muted-foreground">
        記事はまだありません。content/posts ディレクトリにMarkdownファイルを追加してください。
      </p>
    </div>
  );
}
