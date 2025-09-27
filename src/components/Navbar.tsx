'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'Sobre a PND', href: '/sobre' },
    { name: 'Simulados', href: '/simulados' },
    { name: 'Materiais', href: '/materiais' },
    { name: 'Fórum', href: '/forum' },
    { name: 'Dúvidas', href: '/duvidas' },
    { name: 'Blog', href: '/blog' },
  ];

  const openLoginModal = () => {
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalTab('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="bg-blue-700 text-white px-4 py-3 rounded-xl font-bold text-xl shadow-sm">
                Portal PND
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-12 flex items-baseline space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors whitespace-nowrap"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar and Auth Buttons */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar conteúdo..."
                className="w-72 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <button className="absolute right-3 top-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={openLoginModal}
                className="text-gray-600 hover:text-blue-600 px-4 py-2 text-base font-medium transition-colors"
              >
                Entrar
              </button>
              <button
                onClick={openRegisterModal}
                className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-lg text-base font-medium transition-colors shadow-sm"
              >
                Cadastrar
              </button>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-blue-600 px-4 py-2 text-base font-medium transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-50 inline-flex items-center justify-center p-3 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-4 pb-6 space-y-2 sm:px-3 bg-white border-t shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 block px-4 py-3 rounded-lg text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 pb-2 border-t border-gray-200">
              <div className="px-4 space-y-4">
                <input
                  type="text"
                  placeholder="Buscar conteúdo..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                />

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      openLoginModal();
                      setIsMenuOpen(false);
                    }}
                    className="text-center text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      openRegisterModal();
                      setIsMenuOpen(false);
                    }}
                    className="text-center bg-gray-900 text-white hover:bg-gray-800 px-4 py-3 rounded-lg text-base font-medium transition-colors"
                  >
                    Cadastrar
                  </button>
                  <Link
                    href="/admin"
                    className="text-center text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialTab={authModalTab}
      />
    </nav>
  );
}
