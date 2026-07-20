import { motion } from 'framer-motion';

export default function FeatureCards() {
  const features = [
    {
      icon: 'layers',
      title: 'Ronde Langkah-demi-Langkah',
      description: 'Visualisasikan seluruh 10 ronde AES-128, dari Key Expansion awal hingga hasil Ciphertext akhir.',
      iconColor: 'bg-[#dbeafe] text-[#2563eb] dark:bg-[#1e3a8a]/40 dark:text-[#60a5fa]'
    },
    {
      icon: 'grid_on',
      title: 'Transformasi Matriks',
      description: 'Berinteraksi langsung dengan State Matrix 4×4. Amati SubBytes, ShiftRows, dan MixColumns berlangsung secara real-time.',
      iconColor: 'bg-[#ffedd5] text-[#d97706] dark:bg-[#7c2d12]/40 dark:text-[#fb923c]'
    },
    {
      icon: 'terminal',
      title: 'Transparansi Heksadesimal',
      description: 'Tidak ada perhitungan yang disembunyikan. Arahkan kursor ke tiap sel untuk melihat transformasi heksadesimal dan biner di baliknya.',
      iconColor: 'bg-[#f1f5f9] text-[#475569] dark:bg-[#334155]/40 dark:text-[#94a3b8]'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const cardVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 14 }
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:pb-24">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="bg-surface-container dark:bg-surface-container-low rounded-2xl p-6 sm:p-8 
                       border border-outline-variant/40 hover:border-outline hover:shadow-lg transition-colors flex flex-col items-start text-left"
          >
            {/* Soft colored circle containing the icon */}
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${feature.iconColor}`}>
              <span className="material-symbols-outlined text-xl">{feature.icon}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-lg font-bold text-on-surface mb-3">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-on-surface-variant leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}