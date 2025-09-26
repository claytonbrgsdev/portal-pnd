import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Date Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Prova em 26 de outubro de 2025
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Sua vocação{' '}
            <span className="text-blue-600">ensinar</span>,
            <br />
            nossa missão{' '}
            <span className="text-blue-600">aprovar</span>!
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Portal PND: informações, simulados e apoio completo para você
            conquistar sua carreira docente na Prova Nacional Docente
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/simulados"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              ▶ Fazer Simulado Gratuito
            </Link>
            <Link
              href="/materiais"
              className="bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-lg text-lg border border-gray-300 transition-colors shadow-lg hover:shadow-xl"
            >
              📖 Baixar Guia de Estudos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
