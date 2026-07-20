export default function StatsBand() {
  const stats = [
    { number: '128', label: 'KEKUATAN BIT' },
    { number: '10', label: 'RONDE ALGORITMA' },
    { number: '4×4', label: 'STATE MATRIX' },
    { number: '256', label: 'ENTRI S-BOX' }
  ];

  return (
    <section className="bg-surface-container/50 dark:bg-surface-container-low/50 py-12 border-y border-outline-variant">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <div key={index} className="text-center relative">
              {/* Vertical divider - hidden on mobile, visible on md+ except for last item */}
              {index < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-outline-variant"></div>
              )}
              
              <div className="text-4xl md:text-5xl font-bold text-accent-orange mb-2">
                {stat.number}
              </div>
              <div className="text-xs text-on-surface-variant uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}