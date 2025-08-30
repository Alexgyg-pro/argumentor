module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  rules: {
    // Exemple de règle personnalisée
    'no-unused-vars': ['error', { varsIgnorePattern: '^_' }]
  }
};