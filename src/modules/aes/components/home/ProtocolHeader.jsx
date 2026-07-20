export default function ProtocolHeader() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-start justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-background mb-4">
            Membedah Protokol AES
          </h2>
          <p className="text-lg text-on-surface-variant leading-relaxed">
            Simulator ini menguraikan Advanced Encryption Standard ke dalam modul 
            visual yang mudah dipahami, ditujukan bagi peneliti maupun mahasiswa.
          </p>
        </div>
        
        {/* Carousel dots indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div className="w-2 h-2 bg-accent-orange rounded-full"></div>
          <div className="w-2 h-2 bg-outline-variant rounded-full"></div>
          <div className="w-2 h-2 bg-outline-variant rounded-full"></div>
        </div>
      </div>
    </section>
  );
}