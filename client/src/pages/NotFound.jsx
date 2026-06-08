import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-10">
      <div className="card w-full max-w-lg p-8 text-center sm:p-12">
        <div className="relative mx-auto mb-6 flex h-28 w-28 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100" />
          <span className="relative text-6xl font-black text-gradient">404</span>
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-500">Page not found</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Oops! This page doesn't exist</h1>
        <p className="mt-3 text-slate-500">
          The page you're looking for doesn't exist, or it may have moved.
        </p>
        <Link to="/" className="btn-primary mt-8 inline-flex gap-2">
          <FiHome size={16} />
          Go to Home
        </Link>
      </div>
    </div>
  );
}
