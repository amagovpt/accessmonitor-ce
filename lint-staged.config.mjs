export default {
  '*.{js,jsx,ts,tsx}': ['prettier --write', () => 'tsc --noEmit'],
  '*.{json,md,css}': ['prettier --write'],
};
