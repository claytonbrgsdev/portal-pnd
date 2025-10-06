'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import LoginLogoutButton from '@/components/LoginLogoutButton';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<{ total: number; finished: number; avg: number } | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/admin/database/data/simulado_attempts?page=1&limit=5&orderBy=started_at');
      const json = await res.json();
      const list: any[] = json?.data || [];
      setRecent(list);
      const finished = list.filter(a => !!a.finished_at);
      const avg = finished.length > 0 ? finished.reduce((s, a) => s + Number(a.score || 0), 0) / finished.length : 0;
      setStats({ total: list.length, finished: finished.length, avg });
    };
    void load();
  }, []);

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
                Bem-vindo ao seu painel! Acompanhe seus simulados e desempenho.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg bg-blue-50 text-center">
                  <div className="text-2xl font-bold text-blue-700">{stats?.total ?? 0}</div>
                  <div className="text-sm text-blue-800">Simulados (últimos)</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 text-center">
                  <div className="text-2xl font-bold text-green-700">{stats?.finished ?? 0}</div>
                  <div className="text-sm text-green-800">Finalizados</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 text-center">
                  <div className="text-2xl font-bold text-purple-700">{(stats?.avg ?? 0).toFixed(0)}%</div>
                  <div className="text-sm text-purple-800">Média de Pontuação</div>
                </div>
              </div>

              {recent.length > 0 && (
                <div className="text-left mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Últimos simulados</h2>
                  <div className="space-y-2">
                    {recent.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium">{new Date(a.started_at).toLocaleString('pt-BR')}</div>
                          <div className="text-xs text-gray-600">{a.finished_at ? 'Finalizado' : 'Em andamento'}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{a.correct_answers}/{a.total_questions}</div>
                          <div className="text-xs text-gray-600">{Number(a.score || 0).toFixed(0)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                <button onClick={() => router.push('/simulados')} className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  Começar Simulado
                </button>
                <button onClick={() => router.push('/simulados/historico')} className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                  Histórico
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
