import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4">
        <span className="text-xs uppercase tracking-widest text-terracotta font-semibold">
          404 Error
        </span>
        <h1 className="font-playfair text-3xl font-bold text-dusk">
          Page Not Found
        </h1>
        <p className="text-sm text-mutedText">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-terracotta px-5 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-terracotta-hover focus-visible:outline-none"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
