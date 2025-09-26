'use client';

import { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Receba materiais gratuitos
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Dicas de estudo, simulados e novidades da PND direto no seu e-mail
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-lg transition-colors shadow-lg"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-green-100 text-green-800 px-6 py-4 rounded-lg inline-block">
              <p className="font-semibold">✓ Cadastro realizado com sucesso!</p>
              <p className="text-sm mt-1">Você receberá nossos materiais em breve.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
