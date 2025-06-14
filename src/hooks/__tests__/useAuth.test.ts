import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { supabase } from '../../lib/supabase';
import { mockAuthUser, mockProfile } from '../../test/mocks/authData';

// Mock the supabase module
vi.mock('../../lib/supabase');

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    // Mock initial session check
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBe(null);
  });

  it('should load user session on mount', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    // Mock session and profile fetch
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    const mockSupabaseFrom = vi.mocked(supabase.from);
    mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    } as any);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockAuthUser);
  });

  it('should handle sign up successfully', async () => {
    const mockSignUpData = {
      email: 'newuser@example.com',
      password: 'password123',
      fullName: 'New User',
      role: 'buyer' as const,
      companyName: 'New Company',
      phone: '+1234567890',
    };

    // Mock auth signup
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: {
        user: {
          id: 'new-user-123',
          email: 'newuser@example.com',
        },
        session: null,
      },
      error: null,
    });

    // Mock profile creation
    const mockSupabaseFrom = vi.mocked(supabase.from);
    mockSupabaseFrom.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    } as any);

    const { result } = renderHook(() => useAuth());

    let signUpResult;
    await act(async () => {
      signUpResult = await result.current.signUp(
        mockSignUpData.email,
        mockSignUpData.password,
        {
          fullName: mockSignUpData.fullName,
          role: mockSignUpData.role,
          companyName: mockSignUpData.companyName,
          phone: mockSignUpData.phone,
        }
      );
    });

    expect(signUpResult.error).toBe(null);
    expect(vi.mocked(supabase.auth.signUp)).toHaveBeenCalledWith({
      email: mockSignUpData.email,
      password: mockSignUpData.password,
      options: {
        data: {
          full_name: mockSignUpData.fullName,
          role: mockSignUpData.role,
          company_name: mockSignUpData.companyName,
          phone: mockSignUpData.phone,
        },
      },
    });
  });

  it('should handle sign up errors', async () => {
    // Mock auth signup error
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already registered' },
    });

    const { result } = renderHook(() => useAuth());

    let signUpResult;
    await act(async () => {
      signUpResult = await result.current.signUp(
        'existing@example.com',
        'password123',
        {
          fullName: 'Test User',
          role: 'buyer',
        }
      );
    });

    expect(signUpResult.error).toBe('Email already registered');
  });

  it('should handle sign in successfully', async () => {
    // Mock auth signin
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
        session: {},
      },
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    let signInResult;
    await act(async () => {
      signInResult = await result.current.signIn('test@example.com', 'password123');
    });

    expect(signInResult.error).toBe(null);
    expect(vi.mocked(supabase.auth.signInWithPassword)).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should handle sign in errors', async () => {
    // Mock auth signin error
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid credentials' },
    });

    const { result } = renderHook(() => useAuth());

    let signInResult;
    await act(async () => {
      signInResult = await result.current.signIn('test@example.com', 'wrongpassword');
    });

    expect(signInResult.error).toBe('Invalid credentials');
  });

  it('should handle sign out successfully', async () => {
    // Mock auth signout
    vi.mocked(supabase.auth.signOut).mockResolvedValue({
      error: null,
    });

    const { result } = renderHook(() => useAuth());

    let signOutResult;
    await act(async () => {
      signOutResult = await result.current.signOut();
    });

    expect(signOutResult.error).toBe(null);
    expect(result.current.user).toBe(null);
  });

  it('should handle auth state changes', async () => {
    let authStateCallback: any;

    // Mock auth state change listener
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((callback) => {
      authStateCallback = callback;
      return {
        data: { subscription: { unsubscribe: vi.fn() } },
      };
    });

    // Mock profile fetch
    const mockSupabaseFrom = vi.mocked(supabase.from);
    mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    } as any);

    const { result } = renderHook(() => useAuth());

    // Simulate auth state change
    await act(async () => {
      authStateCallback('SIGNED_IN', {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      });
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockAuthUser);
    });
  });

  it('should handle profile fetch errors gracefully', async () => {
    const mockSession = {
      user: {
        id: 'user-123',
        email: 'test@example.com',
      },
    };

    // Mock session
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: mockSession },
      error: null,
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });

    // Mock profile fetch error
    const mockSupabaseFrom = vi.mocked(supabase.from);
    mockSupabaseFrom.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Profile not found' },
          }),
        }),
      }),
    } as any);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
  });

  it('should cleanup auth listener on unmount', () => {
    const mockUnsubscribe = vi.fn();

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } },
    });

    const { unmount } = renderHook(() => useAuth());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle different user roles correctly', async () => {
    const roles = ['buyer', 'supplier', 'delivery_partner'] as const;

    for (const role of roles) {
      const roleProfile = { ...mockProfile, role };
      const roleUser = { ...mockAuthUser, role, profile: roleProfile };

      // Mock profile fetch for specific role
      const mockSupabaseFrom = vi.mocked(supabase.from);
      mockSupabaseFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: roleProfile,
              error: null,
            }),
          }),
        }),
      } as any);

      const mockSession = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession },
        error: null,
      });

      const { result, unmount } = renderHook(() => useAuth());

      await waitFor(() => {
        expect(result.current.user?.role).toBe(role);
      });

      unmount();
      vi.clearAllMocks();
    }
  });
});