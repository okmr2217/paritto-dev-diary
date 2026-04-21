import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PROFILE_LINKS } from "@/lib/constants";
import { Github, Mail, Twitter, User } from "lucide-react";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Web Developer Daichi のプロフィールページ。経歴・技術スタック・個人開発プロダクトを紹介しています。",
};

export default function AboutPage() {
  return (
    <div className="space-y-12 pt-6">
      <PageHero
        title="About"
        description="開発者のプロフィール、経歴、技術スタック、制作物などをまとめています。"
        icon={User}
      />

      {/* Profile */}
      <section className="flex items-center gap-6">
        <div className="shrink-0 relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-accent/20">
          <Image
            src="/profile.jpg"
            alt="プロフィール画像"
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold font-heading mb-2">Daichi</h2>
          <p className="text-muted-foreground leading-relaxed">
            2007年生まれ。製造業向けシステム開発と個人開発をしています。
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* What I Do Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-heading tech-gradient-text">
          やっていること
        </h2>

        <div className="space-y-4 max-w-4xl">
          {/* Item 1 */}
          <div className="group p-6 bg-card border-l-4 border-accent rounded-r-lg hover:bg-muted/30 transition-all duration-300">
            <h3 className="text-lg font-bold font-heading mb-2 flex items-center gap-2">
              <span className="text-accent">業務</span>
              <span className="text-muted-foreground">—</span>
              <span>製造業向けシステム</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              現場で使われる前提のシステムを作ることが多いです。
              要件だけでなく、運用・端末・回線・権限などの制約を先に整理してから設計するようにしています。
            </p>
          </div>

          {/* Item 2 */}
          <div className="group p-6 bg-card border-l-4 border-primary rounded-r-lg hover:bg-muted/30 transition-all duration-300">
            <h3 className="text-lg font-bold font-heading mb-2 flex items-center gap-2">
              <span className="text-primary">個人</span>
              <span className="text-muted-foreground">—</span>
              <span>身近な課題のWebアプリ</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              自分や友人が実際に使う前提で、小さく作って改善します。
              自分用のTODOリストアプリや、友達と麻雀をするときの点数管理アプリなど。
              「とりあえず触れるものを出す →
              使われ方を見て直す」のサイクルが好きです。
            </p>
          </div>

          {/* Item 3 */}
          <div className="group p-6 bg-card border-l-4 border-tech-cyan rounded-r-lg hover:bg-muted/30 transition-all duration-300">
            <h3 className="text-lg font-bold font-heading mb-2 flex items-center gap-2">
              <span className="text-tech-cyan">AI</span>
              <span className="text-muted-foreground">—</span>
              <span>設計と検証を早く回す</span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Claude
              Codeを使っていて、以前と比べて作りたいと思ったものがAIの活用のおかげですぐに形にできるので、楽しいです。
              コーディング量を減らして、要件整理・設計・検証に時間を使えるので、いまの自分には合っていると感じています。
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Development Flow Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-heading tech-gradient-text">
          開発の流れ
        </h2>

        <div className="relative max-w-4xl">
          {/* Vertical Flow Line */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-primary to-tech-cyan" />

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="relative flex gap-3 md:gap-6">
              <div className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-accent flex items-center justify-center font-bold text-accent text-sm md:text-base z-10">
                01
              </div>
              <div className="flex-1 pt-1 md:pt-2">
                <h3 className="text-lg md:text-xl font-bold font-heading mb-2 text-accent">
                  課題整理 & 要件定義
                </h3>
                <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
                  <p className="text-sm md:text-base text-foreground leading-relaxed">
                    バイブコーディングでゼロから作るときは、まず課題ややりたいことを整理してAIにどのように解決できるか相談します。
                    それからアプリとしての要件定義を固めて、ページ構成やDB設計・API設計などを決めてマークダウンファイルにまとめます。
                    ワードとかエクセルよりマークダウンの方が簡単に扱えるし、AIとの相性も良いので気に入っています。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex gap-3 md:gap-6">
              <div className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center font-bold text-primary text-sm md:text-base z-10">
                02
              </div>
              <div className="flex-1 pt-1 md:pt-2">
                <h3 className="text-lg md:text-xl font-bold font-heading mb-2 text-primary">
                  実装 & リリース & フィードバック
                </h3>
                <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
                  <p className="text-sm md:text-base text-foreground leading-relaxed">
                    実装時は、それらのマークダウンファイルをAIに参照させながら進めます。
                    リリース後は、実際に自分でしっかり使ったり、友人に使ってもらったりして、改善する必要がある箇所やいいアイデアを思い付いたらすぐにメモします（自分で作ったTODOリストアプリに記録しています）。
                    その改善アイデアのメモを見て、AIと相談しながら実装して、アプリの改善を繰り返していきます。
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex gap-3 md:gap-6">
              <div className="relative shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-tech-cyan flex items-center justify-center font-bold text-tech-cyan text-sm md:text-base z-10">
                03
              </div>
              <div className="flex-1 pt-1 md:pt-2">
                <h3 className="text-lg md:text-xl font-bold font-heading mb-2 text-tech-cyan">
                  継続的な改善
                </h3>
                <div className="p-4 md:p-6 bg-card border border-border rounded-lg">
                  <p className="text-sm md:text-base text-foreground leading-relaxed">
                    自分で使用頻度が高いアプリはやっぱり改善アイデアもたくさん出てくるし、改善することで自分に恩恵が受けられるのでモチベーションになります。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-heading tech-gradient-text">
          これまで
        </h2>
        <div className="max-w-4xl p-6 bg-card border border-border rounded-lg">
          <p className="text-foreground leading-relaxed">
            高校1年で中退後、株式会社CansでアルバイトとしてWeb制作（コーダー）を開始しました。
            同社でアプリ開発や自動AI音声コールシステムの開発などを経験し、現在は株式会社ユニフェイスで製造業向けシステムの開発に携わっています。
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Recent Projects Section */}
      <section className="space-y-8">
        <div>
          <h2 className="text-xl font-bold font-heading tech-gradient-text mb-3">
            最近の抜粋
          </h2>
          <p className="text-muted-foreground">
            強く推すというより、「最近やっていたこと」の抜粋です。
          </p>
        </div>

        <div className="space-y-6 max-w-4xl">
          {/* Yarukoto */}
          <article className="px-6 pt-5 pb-4 bg-card border border-border rounded-xl transition-shadow duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-heading">
                Yarukoto
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                「今日やること」を中心にした、シンプルな日々のタスク管理アプリ。既存のTODOアプリは多機能すぎて短期タスクの管理には向いていないと感じ、ガントチャートもサブタスクも必要ない「今日〜1週間程度」のタスクをサッと整理できるものを作りました。
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {PROFILE_LINKS.yarukoto.demo && (
                  <a
                    href={PROFILE_LINKS.yarukoto.demo}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded font-medium hover:opacity-80"
                  >
                    Demo
                  </a>
                )}
                {PROFILE_LINKS.yarukoto.repo && (
                  <a
                    href={PROFILE_LINKS.yarukoto.repo}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded font-medium hover:opacity-80"
                  >
                    Repo
                  </a>
                )}
                {PROFILE_LINKS.yarukoto.blog && (
                  <Link
                    href={PROFILE_LINKS.yarukoto.blog}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded font-medium hover:opacity-80"
                  >
                    Blog
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* Monster Call */}
          <article className="px-6 pt-5 pb-4 bg-card border border-border rounded-xl transition-shadow duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-heading">
                Monster Call
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                自動音声アナウンスで架電を行い、結果をデータとして記録・管理するシステム。前職で開発に携わり、1日20万〜80万件のコール結果を扱う規模でした。大量データを前提としたクエリ設計やメモリオーバーフロー対策など、パフォーマンスを意識した実装を心がけました。
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="https://monstercall.cans01.jp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-accent text-accent-foreground rounded font-medium hover:opacity-80"
                >
                  Site
                </a>
                {PROFILE_LINKS.monsterCall.blog && (
                  <Link
                    href={PROFILE_LINKS.monsterCall.blog}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded font-medium hover:opacity-80"
                  >
                    Blog
                  </Link>
                )}
              </div>
            </div>
          </article>

          {/* Jansuko */}
          <article className="px-6 pt-5 pb-4 bg-card border border-border rounded-xl transition-shadow duration-300 hover:shadow-lg">
            <div className="space-y-3">
              <h3 className="text-lg font-bold font-heading">
                あいフェス
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                愛知県を中心とした高校の文化祭情報をまとめたサイト。日程や一般公開の有無など、外部から訪れたい人に必要な情報を集約し、いいねやコメント機能でコミュニティとしても盛り上がるように設計しました。同世代の友人と共同運営しています。
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {PROFILE_LINKS.aifes.demo && (
                  <a
                    href={PROFILE_LINKS.aifes.demo}
                    className="px-3 py-1 bg-accent text-accent-foreground rounded font-medium hover:opacity-80"
                  >
                    Demo
                  </a>
                )}
                {PROFILE_LINKS.aifes.repo && (
                  <a
                    href={PROFILE_LINKS.aifes.repo}
                    className="px-3 py-1 bg-secondary text-secondary-foreground rounded font-medium hover:opacity-80"
                  >
                    Repo
                  </a>
                )}
                {PROFILE_LINKS.aifes.instagram && (
                  <Link
                    href={PROFILE_LINKS.aifes.instagram}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded font-medium hover:opacity-80"
                  >
                    Instagram
                  </Link>
                )}
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Tech Stack Section */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold font-heading tech-gradient-text">
          技術スタック
        </h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-bold font-heading mb-3">
              言語 & フレームワーク
            </h3>
            <p className="text-foreground leading-relaxed mb-3">
              個人開発と仕事ではTypeScript、Next.jsを使っています。Next.jsは一番お気に入りです。
              業務ではC#、.NETも使います。UIはTailwind
              CSS、shadcn/uiが好きです。
            </p>
          </div>

          <div className="p-6 bg-card border border-border rounded-lg">
            <h3 className="text-lg font-bold font-heading mb-3">
              AI & デプロイ
            </h3>
            <p className="text-foreground leading-relaxed mb-3">
              AIは個人開発ではClaude Codeを、業務ではCodexも使います。
              技術選定は、会社では技術スタックに従いますが、個人開発ではネット上の情報量の多さやAIとの相性、将来的に仕事として使えそうな技術かどうかを意識しています。
              Next.jsはVercelで無料でホスティングできて、デプロイしやすいのも良いですね。
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Contact Section */}
      <section id="contact" className="space-y-6">
        <h2 className="text-xl font-bold font-heading tech-gradient-text">
          連絡先
        </h2>

        <div className="max-w-2xl space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {PROFILE_LINKS.contact.github && (
              <a
                href={PROFILE_LINKS.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-accent transition-all duration-300"
              >
                <Github className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex-1">
                  <div className="font-medium font-heading">GitHub</div>
                  <div className="text-sm text-muted-foreground">
                    コードとプロジェクト
                  </div>
                </div>
              </a>
            )}

            {PROFILE_LINKS.contact.x && (
              <a
                href={PROFILE_LINKS.contact.x}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-accent transition-all duration-300"
              >
                <Twitter className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex-1">
                  <div className="font-medium font-heading">X (Twitter)</div>
                  <div className="text-sm text-muted-foreground">
                    日々の開発記録
                  </div>
                </div>
              </a>
            )}

            {PROFILE_LINKS.contact.email && (
              <a
                href={`mailto:${PROFILE_LINKS.contact.email}`}
                className="group flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-accent transition-all duration-300"
              >
                <Mail className="w-6 h-6 text-muted-foreground group-hover:text-accent transition-colors" />
                <div className="flex-1">
                  <div className="font-medium font-heading">Email</div>
                  <div className="text-sm text-muted-foreground">
                    お問い合わせ
                  </div>
                </div>
              </a>
            )}
          </div>

          <div className="p-6 bg-muted/30 border-l-4 border-accent rounded-r-lg">
            <p className="text-foreground leading-relaxed">
              連絡はメールまたはSNSからお願いします。内容が固まっていなくても大丈夫です。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
