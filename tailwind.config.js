/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ========================
      // NEOBRUTALISM PASTEL (new unified theme)
      // ========================
      colors: {
        'nb-pink':   '#FF8FD8',
        'nb-teal':   '#5FE3C4',
        'nb-yellow': '#FFE156',
        'nb-blue':   '#7EC8FF',
        'nb-bg':     '#FFF8F0',
        'nb-text':   '#111111',
        'nb-white':  '#FFFFFF',
        'nb-error':  '#FF5757',

        // ========================
        // TUGAS 11 (DES) legacy colors — kept intact so components work
        // ========================
        brutal: {
          yellow:  '#FFE156',   // remapped to nb-yellow
          purple:  '#7EC8FF',   // remapped to nb-blue
          orange:  '#FF8FD8',   // remapped to nb-pink
          green:   '#5FE3C4',   // remapped to nb-teal
          coral:   '#FF5757',
          cream:   '#FFF8F0',   // remapped to nb-bg
          surface: '#F5F0E8',
          black:   '#111111',
          white:   '#FFFFFF',
        },

        // ========================
        // TUGAS 13 (AES) legacy CSS variable references
        // ========================
        surface:                      'var(--surface, #FFFFFF)',
        'surface-dim':                'var(--surface-dim, #F5F5F5)',
        'surface-bright':             'var(--surface-bright, #FFFFFF)',
        'surface-container-lowest':   'var(--surface-container-lowest, #FFFFFF)',
        'surface-container-low':      'var(--surface-container-low, #F8F8F8)',
        'surface-container':          'var(--surface-container, #F0F0F0)',
        'surface-container-high':     'var(--surface-container-high, #E8E8E8)',
        'surface-container-highest':  'var(--surface-container-highest, #E0E0E0)',
        'on-surface':                 'var(--on-surface, #111111)',
        'on-surface-variant':         'var(--on-surface-variant, #444444)',
        'inverse-surface':            'var(--inverse-surface, #111111)',
        'inverse-on-surface':         'var(--inverse-on-surface, #FFFFFF)',
        'outline':                    'var(--outline, #111111)',
        'outline-variant':            'var(--outline-variant, #AAAAAA)',
        'surface-tint':               'var(--surface-tint, #FF8FD8)',
        'primary':                    'var(--primary, #FF8FD8)',
        'on-primary':                 'var(--on-primary, #111111)',
        'primary-container':          'var(--primary-container, #FFDAF0)',
        'on-primary-container':       'var(--on-primary-container, #111111)',
        'inverse-primary':            'var(--inverse-primary, #FF8FD8)',
        'secondary':                  'var(--secondary, #5FE3C4)',
        'on-secondary':               'var(--on-secondary, #111111)',
        'secondary-container':        'var(--secondary-container, #CCFAF0)',
        'on-secondary-container':     'var(--on-secondary-container, #111111)',
        'tertiary':                   'var(--tertiary, #FFE156)',
        'on-tertiary':                'var(--on-tertiary, #111111)',
        'tertiary-container':         'var(--tertiary-container, #FFF9CC)',
        'on-tertiary-container':      'var(--on-tertiary-container, #111111)',
        'error':                      'var(--error, #FF5757)',
        'on-error':                   'var(--on-error, #FFFFFF)',
        'error-container':            'var(--error-container, #FFD0D0)',
        'on-error-container':         'var(--on-error-container, #111111)',
        'background':                 'var(--background, #FFF8F0)',
        'on-background':              'var(--on-background, #111111)',
        'surface-variant':            'var(--surface-variant, #F0EDE8)',
        'accent-orange':              'var(--accent-orange, #FF8FD8)',
        'accent-orange-light':        'var(--accent-orange-light, #FFDAF0)',
      },

      boxShadow: {
        // Neobrutalism pastel
        'nb':     '4px 4px 0px #111111',
        'nb-sm':  '2px 2px 0px #111111',
        'nb-lg':  '6px 6px 0px #111111',
        'nb-xl':  '8px 8px 0px #111111',
        'nb-pink':   '4px 4px 0px #FF8FD8',
        'nb-teal':   '4px 4px 0px #5FE3C4',
        'nb-yellow': '4px 4px 0px #FFE156',
        'nb-blue':   '4px 4px 0px #7EC8FF',
        // DES legacy
        'brutal-sm': '3px 3px 0 0 #111111',
        'brutal':    '6px 6px 0 0 #111111',
        'brutal-lg': '8px 8px 0 0 #111111',
      },

      fontFamily: {
        // Neobrutalism new
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Space Grotesk"', 'sans-serif'],
        // DES legacy aliases
        syne:    ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        inter:   ['"Space Grotesk"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
        // AES legacy aliases
        sans:    ['"Space Grotesk"', 'sans-serif'],
      },

      borderWidth: {
        '3': '3px',
        '4': '4px',
        '5': '5px',
      },

      borderRadius: {
        'nb': '2px',
      },

      keyframes: {
        'press': {
          '0%, 100%': { transform: 'translate(0,0)', boxShadow: '4px 4px 0px #111111' },
          '50%':      { transform: 'translate(2px,2px)', boxShadow: '2px 2px 0px #111111' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'press':    'press 0.15s ease-in-out',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
