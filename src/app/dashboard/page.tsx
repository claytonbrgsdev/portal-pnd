'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import LoginLogoutButton from '@/components/LoginLogoutButton';

export default function DashboardPage() {
  const { user, profile } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo, {profile?.name || user?.email}!
                </p>
              </div>
              <LoginLogoutButton />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Painel do Usuário
              </h1>

              <p className="text-lg text-gray-600 mb-8">
                Bem-vindo ao seu painel pessoal! Esta página será desenvolvida futuramente
                com funcionalidades personalizadas para usuários logados.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h2 className="text-lg font-semibold text-green-900 mb-2">
                  Funcionalidades Futuras
                </h2>
                <ul className="text-green-800 text-left space-y-1">
                  <li>• Histórico de simulados realizados</li>
                  <li>• Progresso de estudos</li>
                  <li>• Materiais favoritos</li>
                  <li>• Configurações da conta</li>
                  <li>• Notificações personalizadas</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Começar Simulado
                </button>
                <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                  Ver Materiais
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
