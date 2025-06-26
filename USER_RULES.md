# User Rules for GastroHub Development

## Terminal Commands
- **ALWAYS use PowerShell commands** - You are on Windows with PowerShell as your shell
- Use `pwsh` or `powershell` commands, not bash/cmd
- For package management, use `npm` commands (not yarn)
- For database operations, use Supabase CLI commands and supabase-mcp-server
- For file operations, use PowerShell syntax (e.g., `Get-ChildItem` instead of `ls`)

## Code Style & Standards
- Use TypeScript for all new code
- Follow React functional component patterns with hooks
- Use Tailwind CSS for styling
- Implement proper error handling and loading states
- Write unit tests for new components and hooks
- Use ESLint and Prettier for code formatting

## Project Structure
- Keep components in `src/components/` organized by feature
- Place pages in `src/pages/` with proper routing
- Store hooks in `src/hooks/` for reusable logic
- Use `src/types/` for TypeScript type definitions
- Keep utilities in `src/utils/` for helper functions

## Database & Supabase
- Use Supabase for all database operations
- Follow the existing schema in `supabase/migrations/`
- Implement proper Row Level Security (RLS) policies
- Use TypeScript types generated from Supabase schema
- Test database operations thoroughly

## Authentication & Authorization
- Use Supabase Auth for user authentication
- Implement role-based access control (buyer, supplier, delivery, super admin)
- Use the existing auth hooks (`useListings`, etc.)
- Protect routes appropriately with `ProtectedRoute` and `RequireRole` components

## UI/UX Guidelines
- Use the existing UI components in `src/components/ui/`
- Maintain consistent design patterns across the application
- Implement responsive design for mobile and desktop
- Use proper loading states and error boundaries
- Follow accessibility best practices

## Testing
- Write unit tests for all new components
- Use Vitest for testing framework
- Place test files in `__tests__` directories
- Mock external dependencies appropriately
- Maintain good test coverage

## Performance
- Implement proper code splitting and lazy loading
- Optimize images and assets
- Use React.memo and useMemo where appropriate
- Monitor bundle size and performance metrics

## Git & Version Control
- Use conventional commit messages
- Create feature branches for new development
- Keep commits atomic and focused
- Update documentation when adding new features

## Security
- Never commit API keys or sensitive data
- Use environment variables for configuration
- Validate all user inputs
- Implement proper CORS policies
- Follow OWASP security guidelines

## Documentation
- Update README.md for new features
- Document complex business logic
- Keep API documentation current
- Update component documentation

## Deployment
- Test thoroughly before deployment
- Use proper environment variables
- Monitor application performance
- Implement proper error tracking (Sentry)

## Specific Project Rules
- GastroHub is a marketplace for food suppliers and buyers
- Support multiple user roles: buyer, supplier, delivery, super admin
- Implement proper order management and tracking
- Support messaging between users
- Handle invoice generation and management
- Implement category management for products
- Support service area management for delivery

## Development Workflow
1. Create feature branch from main
2. Implement feature with tests
3. Update documentation
4. Create pull request
5. Code review and testing
6. Merge to main branch

## Emergency Procedures
- If database schema changes are needed, create proper migrations
- For breaking changes, coordinate with team members
- Document any temporary workarounds
- Report critical issues immediately

---

**Remember**: Always use PowerShell commands, maintain code quality, and follow the established patterns in the codebase. 