import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HomePage } from '../HomePage';
import { useAuth } from '../../hooks/useAuth';

// Mock useAuth hook
vi.mock('../../hooks/useAuth');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it('should render hero section', () => {
    render(<HomePage />);

    expect(screen.getByText('The Future of')).toBeInTheDocument();
    expect(screen.getByText('Food Commerce')).toBeInTheDocument();
    expect(screen.getByText(/Connect buyers, suppliers, and delivery partners/)).toBeInTheDocument();
  });

  it('should render call-to-action buttons', () => {
    render(<HomePage />);

    const getStartedButton = screen.getByText('Get Started Free');
    const exploreButton = screen.getByText('Explore Marketplace');

    expect(getStartedButton).toBeInTheDocument();
    expect(exploreButton).toBeInTheDocument();
    expect(getStartedButton.closest('a')).toHaveAttribute('href', '/register');
    expect(exploreButton.closest('a')).toHaveAttribute('href', '/marketplace');
  });

  it('should render features section', () => {
    render(<HomePage />);

    expect(screen.getByText('Everything You Need to Succeed')).toBeInTheDocument();
    expect(screen.getByText('Smart Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Supplier Tools')).toBeInTheDocument();
    expect(screen.getByText('Delivery Network')).toBeInTheDocument();
    expect(screen.getByText('Secure Payments')).toBeInTheDocument();
  });

  it('should render benefits section', () => {
    render(<HomePage />);

    expect(screen.getByText('Proven Results for Food Businesses')).toBeInTheDocument();
    expect(screen.getByText('Save Time')).toBeInTheDocument();
    expect(screen.getByText('Grow Revenue')).toBeInTheDocument();
    expect(screen.getByText('Build Network')).toBeInTheDocument();
    expect(screen.getByText('Quality Assured')).toBeInTheDocument();
  });

  it('should render testimonials section', () => {
    render(<HomePage />);

    expect(screen.getByText('What Our Users Say')).toBeInTheDocument();
    expect(screen.getByText('Sarah Johnson')).toBeInTheDocument();
    expect(screen.getByText('Mike Chen')).toBeInTheDocument();
    expect(screen.getByText('David Rodriguez')).toBeInTheDocument();
  });

  it('should render footer', () => {
    render(<HomePage />);

    expect(screen.getByText('The leading B2B marketplace for the food industry.')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
  });

  it('should have proper navigation links in footer', () => {
    render(<HomePage />);

    const footerLinks = [
      { text: 'Marketplace', href: '/marketplace' },
      { text: 'Suppliers', href: '/suppliers' },
      { text: 'Delivery', href: '/delivery' },
      { text: 'About', href: '/about' },
      { text: 'Contact', href: '/contact' },
      { text: 'Help Center', href: '/help' },
    ];

    footerLinks.forEach(({ text, href }) => {
      const link = screen.getByText(text);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', href);
    });
  });

  it('should render statistics correctly', () => {
    render(<HomePage />);

    expect(screen.getByText('10,000+ Users')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument(); // Time saved
    expect(screen.getByText('40%')).toBeInTheDocument(); // Revenue increase
    expect(screen.getByText('99.8%')).toBeInTheDocument(); // Order accuracy
  });

  it('should have proper semantic structure', () => {
    render(<HomePage />);

    // Check for main sections
    const sections = screen.getAllByRole('region', { hidden: true });
    expect(sections.length).toBeGreaterThan(0);

    // Check for proper headings hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    const subHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(subHeadings.length).toBeGreaterThan(0);
  });

  it('should be responsive', () => {
    render(<HomePage />);

    // Check for responsive classes
    const heroSection = screen.getByText('The Future of').closest('div');
    expect(heroSection).toHaveClass('text-center');

    // Check for grid layouts
    const gridElements = document.querySelectorAll('[class*="grid"]');
    expect(gridElements.length).toBeGreaterThan(0);
  });

  it('should have proper accessibility attributes', () => {
    render(<HomePage />);

    // Check for alt text on images (if any)
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });

    // Check for proper link attributes
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('href');
    });
  });

  it('should handle different screen sizes', () => {
    render(<HomePage />);

    // Check for responsive text classes
    const responsiveElements = document.querySelectorAll('[class*="md:"], [class*="lg:"]');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });

  it('should have proper color scheme', () => {
    render(<HomePage />);

    // Check for primary color usage
    const primaryElements = document.querySelectorAll('[class*="primary"]');
    expect(primaryElements.length).toBeGreaterThan(0);

    // Check for secondary color usage
    const secondaryElements = document.querySelectorAll('[class*="secondary"]');
    expect(secondaryElements.length).toBeGreaterThan(0);
  });

  it('should render testimonial ratings', () => {
    render(<HomePage />);

    // Check for star ratings (5 stars each for 3 testimonials = 15 stars)
    const stars = document.querySelectorAll('[class*="fill-current"]');
    expect(stars.length).toBe(15);
  });

  it('should have proper call-to-action sections', () => {
    render(<HomePage />);

    expect(screen.getByText('Ready to Transform Your Food Business?')).toBeInTheDocument();
    expect(screen.getByText('Start Free Trial')).toBeInTheDocument();
    expect(screen.getByText('Contact Sales')).toBeInTheDocument();
  });

  it('should display copyright information', () => {
    render(<HomePage />);

    expect(screen.getByText('© 2024 GastroHub. All rights reserved.')).toBeInTheDocument();
  });
});