
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <main className="container mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};
