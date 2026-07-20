import React, { useState } from 'react';
import { useDESStore } from '../../store/desStore.js';
import { NeoCard } from '../common/NeoCard.jsx';
import { Accordion } from '../common/Accordion.jsx';
import { BinaryGrid } from '../common/BinaryGrid.jsx';
import { PC1, PC2 } from '../../services/permutation.js';
import { Key, RotateCw, ArrowRight } from 'lucide-react';

export function KeySchedule() {
  const { result, currentRound } = useDESStore();
  const [showPC1Matrix, setShowPC1Matrix] = useState(false);
  const [expandedRounds, setExpandedRounds] = useState({});

  if (!result) {
    return (
      <NeoCard title="KEY SCHEDULE GENERATION" className="opacity-50">
        <div className="flex flex-col items-center justify-center py-12 text-black/40">
          <Key className="w-12 h-12 stroke-[3px] mb-4" />
          <p className="font-grotesk font-bold uppercase tracking-wider">
          Jalankan simulasi untuk menghasilkan Key Schedule / Penjadwalan Kunci
          </p>
        </div>
      </NeoCard>
    );
  }

  const { keySchedule } = result;
  
  const toggleRound = (round) => {
    setExpandedRounds(prev => ({
      ...prev,
      [round]: !prev[round]
    }));
  };

  return (
    <section id="keysched" className="space-y-6">
      {/* 1. PC-1 SECTION */}
      <NeoCard
        title="1. PEMILIHAN PERMUTASI 1 (PC-1)"
        headerActions={
          <button
            onClick={() => setShowPC1Matrix(!showPC1Matrix)}
            className="px-3 py-1 border-2 border-black bg-brutal-white font-grotesk font-black text-xs uppercase shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {showPC1Matrix ? 'Sembunyikan Tabel' : 'Tampilkan Tabel PC-1'}
          </button>
        }
      >
        <div className="space-y-4">
          <p className="font-inter text-xs text-black/70">
            PC-1 memilih 56 bit dari kunci asli 64-bit, membuang 8 bit paritas (8, 16, 24, 32, 40, 48, 56, 64) dan membagi bit terpilih menjadi dua register 28-bit, yaitu <strong>C0</strong> (Kiri) dan <strong>D0</strong> (Kanan).
          </p>

          {showPC1Matrix && (
            <div className="bg-brutal-surface p-4 border-3 border-black font-mono text-xs shadow-brutal-sm">
              <div className="font-bold border-b border-black/20 pb-2 mb-2 uppercase font-grotesk">
                Matriks Permutasi PC-1 (Urutan indeks bit yang dipilih)
              </div>
              <div className="grid grid-cols-8 gap-2 text-center">
                {PC1.map((val, idx) => (
                  <div key={idx} className="bg-brutal-white p-1 border border-black/40">
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Splits representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 border-3 border-black bg-brutal-purple/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-grotesk font-black text-sm uppercase">REGISTER C0 (KIRI)</span>
                <span className="font-mono text-xs font-bold border border-black bg-brutal-purple px-2 py-0.5">28 BIT</span>
              </div>
              <BinaryGrid
                binaryString={keySchedule.PC1_C0}
                highlightColor="purple"
                bitIndices={Array.from({ length: 28 }, (_, i) => i + 1)}
              />
            </div>

            <div className="p-4 border-3 border-black bg-brutal-orange/10">
              <div className="flex justify-between items-center mb-2">
                <span className="font-grotesk font-black text-sm uppercase">REGISTER D0 (KANAN)</span>
                <span className="font-mono text-xs font-bold border border-black bg-brutal-orange px-2 py-0.5">28 BIT</span>
              </div>
              <BinaryGrid
                binaryString={keySchedule.PC1_D0}
                highlightColor="orange"
                bitIndices={Array.from({ length: 28 }, (_, i) => 29 + i)}
              />
            </div>
          </div>
        </div>
      </NeoCard>

      {/* 2. SUBKEY SCHEDULE 16 ROUNDS */}
      <NeoCard title="2. PERGESERAN REGISTER 16 PUTARAN & SUBKEY (PC-2)">
        <div className="space-y-4">
          <p className="font-inter text-xs text-black/70 font-medium">
            Pada setiap putaran, register C dan D digeser ke kiri (left-shift) sebanyak 1 atau 2 bit sesuai jadwal pergeseran. 
            Kemudian, gabungan blok 56-bit tersebut dipermutasikan melalui <strong>PC-2</strong> untuk menghasilkan subkey 48-bit <strong>K(putaran)</strong>.
          </p>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto border-3 border-black">
            <table className="w-full text-left font-mono text-xs divide-y-3 divide-black border-collapse">
              <thead className="bg-brutal-surface font-grotesk font-extrabold uppercase">
                <tr>
                  <th className="p-3 border-r-3 border-black text-center w-16">Putaran</th>
                  <th className="p-3 border-r-3 border-black text-center w-16">Geser</th>
                  <th className="p-3 border-r-3 border-black">Register C (28-bit)</th>
                  <th className="p-3 border-r-3 border-black">Register D (28-bit)</th>
                  <th className="p-3">Subkey Keluaran PC-2 Ki (48-bit Hex)</th>
                </tr>
              </thead>
              <tbody className="divide-y-3 divide-black bg-brutal-white">
                {keySchedule.steps.map((step) => {
                  const isActive = currentRound === step.round;
                  
                  // Shift bits indices highlight (e.g. show bits that were rotated to the end)
                  const cShiftIndices = Array.from({ length: step.shiftAmount }, (_, i) => 28 - step.shiftAmount + i);
                  const dShiftIndices = Array.from({ length: step.shiftAmount }, (_, i) => 28 - step.shiftAmount + i);

                  return (
                    <tr
                      key={step.round}
                      className={`
                        transition-colors duration-100
                        ${isActive ? 'bg-brutal-yellow/20 font-bold border-y-3 border-black' : 'hover:bg-brutal-cream'}
                      `}
                    >
                      <td className="p-3 border-r-3 border-black text-center font-grotesk font-black text-sm">
                        {step.round.toString().padStart(2, '0')}
                        {isActive && <div className="text-[9px] bg-black text-brutal-yellow font-black px-1 mt-0.5">AKTIF</div>}
                      </td>
                      
                      <td className="p-3 border-r-3 border-black text-center font-bold">
                        {step.shiftAmount}
                      </td>

                      <td className="p-3 border-r-3 border-black max-w-xs overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-black/50">C_prev: {step.C_prev.slice(0, step.shiftAmount)}...</span>
                          <BinaryGrid
                            binaryString={step.C}
                            groupSize={7}
                            highlightIndices={cShiftIndices}
                            highlightColor="purple"
                          />
                        </div>
                      </td>

                      <td className="p-3 border-r-3 border-black max-w-xs overflow-hidden">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-black/50">D_prev: {step.D_prev.slice(0, step.shiftAmount)}...</span>
                          <BinaryGrid
                            binaryString={step.D}
                            groupSize={7}
                            highlightIndices={dShiftIndices}
                            highlightColor="orange"
                          />
                        </div>
                      </td>

                      <td className="p-3 font-grotesk font-extrabold text-sm text-black">
                        <div className="flex items-center gap-2">
                          <span className="border-2 border-black bg-brutal-yellow px-2 py-0.5 shadow-brutal-sm font-mono text-xs">
                            {step.K_hex}
                          </span>
                          <span className="text-[9px] font-mono text-black/40 hidden xl:inline">
                            ({step.K.slice(0, 8)}...)
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Accordion List */}
          <div className="md:hidden space-y-3">
            {keySchedule.steps.map((step) => {
              const isOpen = expandedRounds[step.round];
              const isActive = currentRound === step.round;

              return (
                <Accordion
                  key={step.round}
                  isOpen={isOpen}
                  onToggle={() => toggleRound(step.round)}
                  title={`PUTARAN ${step.round.toString().padStart(2, '0')}`}
                  headerBadge={`K${step.round}`}
                  headerSummary={`Hex: ${step.K_hex}`}
                  variant={isActive ? 'yellow' : 'white'}
                  className={isActive ? 'border-brutal-yellow border-3' : ''}
                >
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-black/10 pb-2">
                      <span className="font-bold font-grotesk uppercase">Jumlah Geser:</span>
                      <span className="bg-black text-white px-2 py-0.5">{step.shiftAmount} Bit ke Kiri</span>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-black/60 uppercase font-grotesk">Register C:</div>
                      <BinaryGrid binaryString={step.C} groupSize={4} highlightColor="purple" />
                      <div className="text-[10px] text-black/40">Sebelumnya: {step.C_prev}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="font-bold text-black/60 uppercase font-grotesk">Register D:</div>
                      <BinaryGrid binaryString={step.D} groupSize={4} highlightColor="orange" />
                      <div className="text-[10px] text-black/40">Sebelumnya: {step.D_prev}</div>
                    </div>

                    <div className="pt-2 border-t border-black/10">
                      <div className="font-bold text-black/60 uppercase font-grotesk mb-1">Subkey Keluaran PC-2 (48-bit):</div>
                      <div className="p-2 bg-brutal-surface border-2 border-black font-mono text-center font-black">
                        {step.K_hex}
                      </div>
                    </div>
                  </div>
                </Accordion>
              );
            })}
          </div>
        </div>
      </NeoCard>
    </section>
  );
}

export default KeySchedule;
