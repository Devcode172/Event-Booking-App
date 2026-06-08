import React from 'react';

export default function Layout({ children }) {
  return (
    <main className="min-h-screen overflow-x-hidden bg-mesh">
      <div className="mx-auto w-full max-w-7xl px-5 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        {children}
      </div>
    </main>
  );
}
