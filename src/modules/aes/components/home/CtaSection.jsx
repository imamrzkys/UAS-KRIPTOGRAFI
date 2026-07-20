import { Link } from 'react-router-dom';

export default function CtaSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 text-center">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-on-background mb-6">
        Siap Membedah Algoritmanya?
      </h2>
      
      <p className="text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto mb-10">
        Bergabunglah dengan mahasiswa dan peneliti keamanan yang menggunakan CipherFlow untuk memahami 
        arsitektur kriptografi modern.
      </p>
      
      <Link
        to="/simulator"
        className="inline-flex items-center gap-2 px-10 py-4 bg-accent-orange text-white 
                 rounded-full font-semibold text-lg hover:bg-accent-orange-light 
                 transition-all duration-300 shadow-lg hover:shadow-xl"
      >
        Mulai Simulasi Sekarang
      </Link>
    </section>
  );
}