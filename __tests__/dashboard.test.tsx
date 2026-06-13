import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
}));

jest.mock('@/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar-mock">Sidebar</div>,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { name: 'TestUser' }, error: null }),
      eq: jest.fn().mockResolvedValue({ data: [{ content: 'test entry' }], error: null })
    })
  }
}));

// Mock fetch for insights API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      hidden_triggers: ['mock trigger'],
      emotional_pattern: 'mock pattern',
      coping_strategy: 'mock strategy'
    }),
  })
) as jest.Mock;

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the dashboard with correct headings', async () => {
    render(<DashboardPage />);
    
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    
    // Wait for async profile fetch
    await waitFor(() => {
      expect(screen.getByText(/Good morning, TestUser/i)).toBeInTheDocument();
    });

    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
    expect(screen.getByText('Focus & Mood Trends')).toBeInTheDocument();
    expect(screen.getByText('Burnout Risk')).toBeInTheDocument();
  });

  it('loads insights successfully', async () => {
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('mock pattern')).toBeInTheDocument();
      expect(screen.getByText('mock trigger')).toBeInTheDocument();
      expect(screen.getByText('mock strategy')).toBeInTheDocument();
    });
  });
});
