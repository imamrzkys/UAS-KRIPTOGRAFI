import PipelineStep from '../../components/simulator/PipelineStep';
import './KeyGenTrace.css';

/**
 * KeyGenTrace - Shows the step-by-step key generation trace (P10 -> LS-1 -> P8 -> K1/K2)
 * @param {Object} props
 * @param {object[]} props.steps - Sub-trace steps for key generation
 */
export default function KeyGenTrace({ steps = [] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div id="trace-step-1" className="keygen-trace">
      <h3 className="keygen-trace__title uppercase">
        Pembangkitan Kunci (Key Generation)
      </h3>
      <div className="keygen-trace__pipeline">
        {steps.map((step, index) => (
          <PipelineStep
            key={index}
            stepNumber={step.step}
            label={step.label}
            description={step.description}
            input={step.input}
            output={step.output}
            table={step.table}
            sbox={step.sbox}
            delay={index * 0.05}
          />
        ))}
      </div>
    </div>
  );
}
