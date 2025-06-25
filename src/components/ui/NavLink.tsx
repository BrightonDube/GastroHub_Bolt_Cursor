import React from 'react';
import { cn } from '../../utils/cn';
import { Link, LinkProps } from 'react-router-dom';

export interface NavLinkProps extends LinkProps {
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
}

export const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, activeClassName = 'neon-underline', children, ...props }, ref) => {
    // You may want to use useLocation() to determine active route for more advanced highlighting
    return (
      <Link
        ref={ref}
        className={cn(
          'relative transition-colors duration-200 hover:text-primary-500 neon-underline',
          className
        )}
        {...props}
      >
        {children}
        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </Link>
    );
  }
);

NavLink.displayName = 'NavLink';

// Neon underline style (add to global CSS or Tailwind config if needed)
// .neon-underline::after {
//   content: '';
//   display: block;
//   height: 2px;
//   width: 100%;
//   background: linear-gradient(90deg, #60a5fa, #3b82f6, #60a5fa);
//   transition: transform 0.3s;
//   transform: scaleX(0);
// }
// .neon-underline:hover::after {
//   transform: scaleX(1);
// }
