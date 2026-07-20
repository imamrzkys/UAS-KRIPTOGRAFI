import { useMemo } from 'react';
import useSimulatorStore from '../../store/simulatorStore';

export default function LaboratoryInsight() {
  const { steps, currentStep, hasResult } = useSimulatorStore();

  // ⚠️ ALL hooks must run before any conditional return
  const currentData = hasResult && steps.length > 0 ? steps[currentStep] : null;
  const label = currentData?.label || '';
  const stepName = currentData?.phase || '';

  const roundText = useMemo(() => {
    if (!label) return '';
    if (label.includes('Key Expansion')) return 'proses Key Expansion';
    if (label.includes('Initial Round')) return 'Ronde Awal';
    const match = label.match(/Round\s+(\d+)/i);
    return match ? `Ronde ${match[1]}` : 'Ronde Awal';
  }, [label]);

  // Early returns are OK AFTER all hooks have been declared
  if (!hasResult || !steps || steps.length === 0 || !currentData) {
    return null;
  }

  return (
    <div className="bg-secondary-container/50 rounded-2xl p-6 border border-secondary/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-xl">science</span>
          </div>
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-on-secondary-container mb-1">
            Insight Laboratorium
          </h3>
          <p className="text-sm text-on-secondary-container/80 leading-relaxed">
            Anda sedang melihat detail proses untuk <strong>{roundText}</strong> pada fase transformasi <strong>{stepName}</strong>. Matriks di bawah menunjukkan State Matrix sebelum (kiri) dan sesudah (kanan) operasi tersebut dilakukan.
          </p>
        </div>
      </div>
    </div>
  );
}
