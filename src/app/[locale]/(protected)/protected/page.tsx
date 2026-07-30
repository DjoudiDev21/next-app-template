export default function ProtectedPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
        Protected route
      </p>
      <h1 className="text-4xl font-bold">Your session is valid</h1>
      <p className="mt-4 text-slate-600 dark:text-slate-300">
        This page demonstrates server-side route protection without database or
        product-specific user logic.
      </p>
    </section>
  );
}
