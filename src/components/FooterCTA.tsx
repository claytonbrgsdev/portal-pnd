import Link from 'next/link';

export default function FooterCTA() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Você não está sozinho nessa jornada
        </h2>
        <p className="text-xl text-blue-100 mb-12 leading-relaxed">
          Conte conosco para alcançar seu sonho de sala de aula! Transforme vidas
          através da educação começando pela sua aprovação.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/simulados"
            className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            ▶ Começar Agora - É Grátis
          </Link>
          <Link
            href="/cursos"
            className="bg-blue-800 hover:bg-blue-900 text-white font-semibold py-4 px-8 rounded-lg text-lg border border-blue-500 transition-colors shadow-lg hover:shadow-xl"
          >
            ➤ Ver Planos Premium
          </Link>
        </div>
      </div>
    </section>
  );
}
