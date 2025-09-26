export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Maria Rodrigues',
      role: 'Licencianda em Matemática',
      avatar: 'MR',
      content: 'Os simulados do Portal PND me ajudaram muito a entender o formato da prova. Consegui identificar meus pontos fracos e focar nos estudos. Recomendo!',
      rating: 5
    },
    {
      name: 'João Silva',
      role: 'Professor de História',
      avatar: 'JS',
      content: 'A comunidade é incrível! Sempre tem alguém disposto a ajudar. Os materiais são atualizados e a central de dúvidas é muito eficiente.',
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Histórias de Sucesso
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Veja como outros futuros professores estão se preparando conosco
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-xl p-8 relative">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>

              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              <div className="flex items-center">
                <div className="flex mr-3">
                  {renderStars(testimonial.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
