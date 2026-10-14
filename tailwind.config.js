/** Strict palette: black / smoke grey / white. No rounded corners, no soft shadows. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    borderRadius: { none: '0', DEFAULT: '0' },
    boxShadow: { none: 'none' },
    colors: {
      transparent: 'transparent',
      ink: '#000000',
      char: '#18181b',
      smoke: '#27272a',
      line: '#3f3f46',
      dim: '#52525b',
      mute: '#a1a1aa',
      ash: '#d4d4d8',
      white: '#ffffff',
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
