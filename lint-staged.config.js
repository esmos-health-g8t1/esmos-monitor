export default {
  '*.{js,jsx,ts,tsx}': ['oxfmt --write', 'oxlint --fix'],
  '*.{json,css,md,html}': ['oxfmt --write'],
};
