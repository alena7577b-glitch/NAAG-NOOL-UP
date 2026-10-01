export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <div className="max-w-2xl space-y-6">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          Naag Nool UP
        </span>
        <h1 className="font-playfair text-4xl sm:text-5xl font-bold tracking-tight text-dusk">
          The time to be <em className="italic text-terracotta font-cormorant">ALIVE</em> is now.
        </h1>
        <p className="text-mutedText text-base sm:text-lg leading-relaxed">
          Technical foundation and application initialization established successfully. Ready for Phase 2 UI component and layout development.
        </p>
        <div className="inline-flex items-center gap-3 rounded-full bg-muted px-4 py-2 text-xs font-medium text-dusk">
          <span className="h-2 w-2 rounded-full bg-sage animate-pulse" />
          Phase 1 Foundation Active
        </div>
      </div>
    </main>
  );
}
