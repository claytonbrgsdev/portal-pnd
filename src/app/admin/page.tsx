export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-12">
          <div className="mb-8">
            <svg
              className="w-16 h-16 text-blue-600 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Página do Administrador
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Bem-vindo à área administrativa do Portal PND. Esta página será desenvolvida
            futuramente com funcionalidades para gerenciamento do sistema.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Funcionalidades Futuras
            </h2>
            <ul className="text-blue-800 text-left space-y-1">
              <li>• Gerenciamento de usuários</li>
              <li>• Moderação de conteúdo</li>
              <li>• Análise de dados e relatórios</li>
              <li>• Configurações do sistema</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
