export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Meu Painel</h1>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg p-12 max-w-2xl mx-auto">
            <div className="mb-8">
              <svg
                className="w-16 h-16 text-green-600 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Página do Usuário
            </h1>

            <p className="text-lg text-gray-600 mb-8">
              Bem-vindo ao seu painel pessoal! Esta página será desenvolvida futuramente
              com funcionalidades personalizadas para usuários logados.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
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

            <div className="mt-8">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Começar Simulado
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
