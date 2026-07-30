export default function Home() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
        Next.js authentication template
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
        Provider-neutral authentication, ready for your frontend
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
        Clerk is isolated behind auth contracts. Application views consume a
        generic session API and authenticated requests automatically retry once
        with a rotated token.
      </p>
    </section>
  );
}
