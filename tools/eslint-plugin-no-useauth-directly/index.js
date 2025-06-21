/**
 * @fileoverview Custom ESLint rule: Prevent direct use of useAuth in components/hooks/pages. Only allow in AuthProvider.
 */

module.exports = {
  rules: {
    'no-useauth-directly': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow direct use of useAuth outside AuthProvider',
          category: 'Best Practices',
        },
        schema: [],
        messages: {
          noUseAuth: 'Do NOT use useAuth directly in components/pages/hooks. Use useAuthContext from App.tsx instead.'
        }
      },
      create(context) {
        return {
          ImportDeclaration(node) {
            if (
              node.source.value.includes('useAuth') &&
              node.specifiers.some(
                (s) => s.type === 'ImportSpecifier' && s.imported.name === 'useAuth'
              )
            ) {
              // Allow import ONLY in src/App.tsx (where AuthProvider is defined)
              if (!context.getFilename().replace(/\\/g, '/').endsWith('/src/App.tsx')) {
                context.report({
                  node,
                  messageId: 'noUseAuth',
                });
              }
            }
          },
          CallExpression(node) {
            if (
              node.callee.name === 'useAuth' &&
              !context.getFilename().replace(/\\/g, '/').endsWith('/src/App.tsx')
            ) {
              context.report({
                node,
                messageId: 'noUseAuth',
              });
            }
          },
        };
      },
    },
  },
};
