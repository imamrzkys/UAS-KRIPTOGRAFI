import React from 'react';

/**
5:  * Neubrutalist Sticky Tab Bar
6:  * Displays navigation anchors to jump between different simulation segments.
7:  */
export function StickyTabs({
  tabs = [],
  activeTab = '',
  onTabClick,
  className = ''
}) {
  return (
    <div 
      className={`
        sticky top-[80px] z-30 w-full bg-brutal-white border-b-4 border-black px-4 py-3 sm:px-6 sm:py-4
        flex items-center gap-3 overflow-x-auto whitespace-nowrap horizontal-scroll
        shadow-[0_4px_0_#000] select-none
        ${className}
      `}
    >
      <div className="font-mono text-xs font-black uppercase text-black/50 border-r-2 border-black/20 pr-4 mr-2 hidden sm:inline">
        Sim Step:
      </div>
      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick && onTabClick(tab.id)}
              className={`
                px-3 py-1.5 sm:px-4 sm:py-2 border-3 border-black font-grotesk font-black text-[10px] sm:text-xs uppercase
                transition-all duration-75 select-none
                ${isActive 
                  ? 'bg-brutal-yellow translate-y-0.5 shadow-none text-black font-extrabold' 
                  : 'bg-brutal-white shadow-brutal-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-brutal hover:bg-brutal-cream text-black/70 hover:text-black'}
              `}
              style={{ borderRadius: '0px' }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default StickyTabs;
