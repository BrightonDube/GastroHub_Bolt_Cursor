import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '../DashboardPage';
import { useAuth } from '../../hooks/useAuth';
import { mockAuthUser, mockSupplierAuthUser, mockDeliveryPartnerAuthUser } from '../../test/mocks/authData';

// Mock useAuth hook
vi.mock('../../hooks/useAuth');

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  };
});

// Mock layout components
vi.mock('../../components/layout/DashboardLayout', () => ({
  DashboardLayout: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render buyer dashboard correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Good \w+, Test User!/)).toBeInTheDocument();
    expect(screen.getByText(/buyer account today/)).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Active Suppliers')).toBeInTheDocument();
    expect(screen.getByText('Monthly Spend')).toBeInTheDocument();
    expect(screen.getByText('Pending Orders')).toBeInTheDocument();
  });

  it('should render supplier dashboard correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockSupplierAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Good \w+, Test User!/)).toBeInTheDocument();
    expect(screen.getByText(/supplier account today/)).toBeInTheDocument();
    expect(screen.getByText('Active Listings')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
  });

  it('should render delivery partner dashboard correctly', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockDeliveryPartnerAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Good \w+, Test User!/)).toBeInTheDocument();
    expect(screen.getByText(/delivery_partner account today/)).toBeInTheDocument();
    expect(screen.getByText('Completed Deliveries')).toBeInTheDocument();
    expect(screen.getByText('Active Deliveries')).toBeInTheDocument();
    expect(screen.getByText('Monthly Earnings')).toBeInTheDocument();
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
  });

  it('should display correct time-based greeting', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    // Mock different times of day
    const originalDate = Date;
    
    // Test morning
    vi.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        const mockDate = new originalDate('2024-01-01T08:00:00Z');
        mockDate.getHours = () => 8;
        return mockDate;
      }
      return new originalDate(...args);
    });

    const { rerender } = render(<DashboardPage />);
    expect(screen.getByText('Good morning, Test User!')).toBeInTheDocument();

    // Test afternoon
    vi.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        const mockDate = new originalDate('2024-01-01T14:00:00Z');
        mockDate.getHours = () => 14;
        return mockDate;
      }
      return new originalDate(...args);
    });

    rerender(<DashboardPage />);
    expect(screen.getByText('Good afternoon, Test User!')).toBeInTheDocument();

    // Test evening
    vi.spyOn(global, 'Date').mockImplementation((...args) => {
      if (args.length === 0) {
        const mockDate = new originalDate('2024-01-01T20:00:00Z');
        mockDate.getHours = () => 20;
        return mockDate;
      }
      return new originalDate(...args);
    });

    rerender(<DashboardPage />);
    expect(screen.getByText('Good evening, Test User!')).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('should show role-specific quick actions', () => {
    // Test buyer actions
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    const { rerender } = render(<DashboardPage />);
    expect(screen.getByText('Browse Marketplace')).toBeInTheDocument();
    expect(screen.getByText('View Orders')).toBeInTheDocument();
    expect(screen.getByText('Find Suppliers')).toBeInTheDocument();

    // Test supplier actions
    vi.mocked(useAuth).mockReturnValue({
      user: mockSupplierAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    rerender(<DashboardPage />);
    expect(screen.getByText('Add New Listing')).toBeInTheDocument();
    expect(screen.getByText('Manage Listings')).toBeInTheDocument();
    expect(screen.getByText('View Analytics')).toBeInTheDocument();

    // Test delivery partner actions
    vi.mocked(useAuth).mockReturnValue({
      user: mockDeliveryPartnerAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    rerender(<DashboardPage />);
    expect(screen.getByText('Available Deliveries')).toBeInTheDocument();
    expect(screen.getByText('My Deliveries')).toBeInTheDocument();
    expect(screen.getByText('View Earnings')).toBeInTheDocument();
  });

  it('should render recent orders section', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('Recent Orders')).toBeInTheDocument();
    expect(screen.getByText('ORD-001')).toBeInTheDocument();
    expect(screen.getByText('Fresh Valley Farms')).toBeInTheDocument();
    expect(screen.getByText('$145.00')).toBeInTheDocument();
  });

  it('should render quick actions section', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('Marketplace')).toBeInTheDocument();
    expect(screen.getByText('Payments')).toBeInTheDocument();
    expect(screen.getByText('Delivery Network')).toBeInTheDocument();
  });

  it('should show system status indicators', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    const operationalStatuses = screen.getAllByText('Operational');
    expect(operationalStatuses).toHaveLength(3); // Marketplace, Payments, Delivery Network
  });

  it('should handle user without profile name', () => {
    const userWithoutName = {
      ...mockAuthUser,
      profile: {
        ...mockAuthUser.profile,
        full_name: null,
      },
    };

    vi.mocked(useAuth).mockReturnValue({
      user: userWithoutName,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Good \w+, there!/)).toBeInTheDocument();
  });

  it('should display correct statistics for each role', () => {
    // Test buyer stats
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    const { rerender } = render(<DashboardPage />);
    expect(screen.getByText('24')).toBeInTheDocument(); // Total Orders
    expect(screen.getByText('8')).toBeInTheDocument(); // Active Suppliers
    expect(screen.getByText('$12,450')).toBeInTheDocument(); // Monthly Spend

    // Test supplier stats
    vi.mocked(useAuth).mockReturnValue({
      user: mockSupplierAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    rerender(<DashboardPage />);
    expect(screen.getByText('156')).toBeInTheDocument(); // Active Listings
    expect(screen.getByText('89')).toBeInTheDocument(); // Total Orders
    expect(screen.getByText('$28,750')).toBeInTheDocument(); // Monthly Revenue
  });

  it('should have proper layout structure', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: mockAuthUser,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('should handle missing user gracefully', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
    });

    render(<DashboardPage />);

    // Should still render but with default values
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });
});