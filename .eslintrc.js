module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    jest: true,
    es6: true
  },
  extends: [
    'airbnb-base'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'promise',
    '@typescript-eslint'
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts']
      }
    }
  },
  rules: {
    camelcase: 0,
    'no-bitwise': 0,
    'no-undef-init': 0,
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'no-unused-labels': 0,
    'no-unused-vars': 'off', // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-inferrable-types': 0,
    // note you must disable the base rule as it can report incorrect errors
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/ban-types': 0, // allow using object as a type
    'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['event', 'error'] }],
    'import/order': 'warn',
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never'
      }
    ],
    'no-mixed-operators': 0,
    'max-len': ['warn', { code: 180 }],
    'max-classes-per-file': 0,
    'comma-dangle': ['error', 'never'],
    'consistent-return': 0,
    'react/state-in-constructor': 0,
    'import/prefer-default-export': 0,
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-underscore-dangle': 0,
    'no-fallthrough': 'error',
    'keyword-spacing': 2,
    'no-irregular-whitespace': 2,
    'promise/always-return': 0,
    'promise/no-return-wrap': 0,
    'promise/param-names': 0,
    'promise/catch-or-return': 0,
    'promise/no-native': 'off',
    'promise/no-nesting': 0,
    'promise/no-promise-in-callback': 0,
    'promise/no-callback-in-promise': 0,
    'promise/avoid-new': 0,
    'promise/no-new-statics': 0,
    'promise/no-return-in-finally': 0,
    'promise/valid-params': 0,
    'promise/prefer-await-to-then': 0,
    'promise/prefer-await-to-callbacks': 0,
    'require-await': 'error',
    'no-extra-bind': 'error',
    'no-plusplus': 0,
    'vars-on-top': 0,
    'no-nested-ternary': 0,
    'no-inner-declarations': 0,
    'class-methods-use-this': 'warn',
    'id-length': ['warn', {
      properties: 'never',
      exceptions: ['t', 'i', 'j', 'k', 'x', 'y', 'z', '$']
    }]
  }
};
