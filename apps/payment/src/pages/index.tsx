import { Button, Card } from "@repo/ui";

export default function Home() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Dashboard App</h1>

      <div className="mb-6 flex gap-4">
        <Button variant="primary">Primary Button</Button>
        <Button variant="secondary">Secondary Button</Button>
      </div>

      <div className="grid gap-4">
        <Card title="Welcome to the monorepo">
          This page is served by <strong>Next.js 15</strong> (Pages Router) and
          uses shared components from <code>@repo/ui</code>.
        </Card>

        <Card title="Tailwind v4">
          Styles are applied via CSS-first Tailwind v4 — no config file needed.
        </Card>
      </div>
    </main>
  );
}
