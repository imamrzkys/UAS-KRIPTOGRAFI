import SimulatorLayout from '../layout/SimulatorLayout';
import SimulatorPanel from '../features/simulator/SimulatorPanel';
import ResultPanel from '../features/simulator/ResultPanel';
import SolutionTrace from '../features/simulator/SolutionTrace';
import VisualMatrix from '../features/simulator/VisualMatrix';

/**
 * SimulatorPage - Main page for the S-DES Simulator
 */
export default function SimulatorPage() {
  const mainContent = (
    <>
      <SimulatorPanel />
      <ResultPanel />
      <SolutionTrace />
    </>
  );

  const sidebarContent = (
    <VisualMatrix />
  );

  return (
    <div className="simulator-page animate-fade-in">
      <SimulatorLayout main={mainContent} sidebar={sidebarContent} />
    </div>
  );
}
