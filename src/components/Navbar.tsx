'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, profile, signOut, loading } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
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

            {/* Auth Buttons/User Menu */}
            <div className="flex items-center space-x-3">
              {console.log('Navbar render:', { user: !!user, profile: !!profile, loading, isAdmin }) || user ? (
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium">
                        {profile?.name || user.email}
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm text-gray-600">Logado como</p>
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Meu Painel
                        </Link>
                        {profile?.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Administração
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Sair
                        </button>
                      </div>
                    )}
                  </div>
              ) : (
                <>
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
                </>
              )}
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

                {/* Mobile Auth Section */}
                {!loading && (
                  <div>
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {profile?.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {profile?.name || user.email}
                            </p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Link
                            href="/dashboard"
                            className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Meu Painel
                          </Link>
                          {profile?.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="block text-gray-600 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              Administração
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              handleSignOut();
                              setIsMenuOpen(false);
                            }}
                            className="block w-full text-left text-gray-600 hover:text-red-600 px-3 py-2 text-base font-medium transition-colors"
                          >
                            Sair
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
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
                      </div>
                    )}
                  </div>
                )}
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
