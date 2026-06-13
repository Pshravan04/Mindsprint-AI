import { render, screen, waitFor } from '@testing-library/react';
import TrackerPage from '@/app/tracker/page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: () => '/tracker',
}));

jest.mock('@/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar-mock">Sidebar</div>,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { target_score: 300 }, error: null }),
      order: jest.fn().mockResolvedValue({ 
        data: [
          { id: '1', name: 'Mock 1', score: 250, created_at: '2026-01-01', subject: 'All' }
        ], 
        error: null 
      }),
      insert: jest.fn().mockResolvedValue({ error: null })
    })
  }
}));

// Mock Recharts and its dynamic imports
jest.mock('next/dynamic', () => () => {
  const MockComponent = () => <div data-testid="recharts-mock">Chart</div>;
  MockComponent.displayName = 'MockDynamicComponent';
  return MockComponent;
});

describe('Tracker Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tracker dashboard correctly', async () => {
    render(<TrackerPage />);
    
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByText('Exam Tracker')).toBeInTheDocument();
    
    await waitFor(() => {
      // It should render mock test section
      expect(screen.getByText('Mock Test Performance')).toBeInTheDocument();
      expect(screen.getByText('Log New Score')).toBeInTheDocument();
    });
  });

  it('renders upcoming exams list', () => {
    render(<TrackerPage />);
    expect(screen.getByText('Upcoming Exams')).toBeInTheDocument();
    expect(screen.getByText('JEE Mains (Session 1)')).toBeInTheDocument();
  });
});
