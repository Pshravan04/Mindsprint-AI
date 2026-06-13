import { render, screen, waitFor } from '@testing-library/react';
import JournalPage from '@/app/journal/page';

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: () => '/journal',
}));

jest.mock('@/components/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar-mock">Sidebar</div>,
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ 
        data: [
          { id: '1', role: 'user', content: 'Hello AI' },
          { id: '2', role: 'ai', content: 'Hello User' }
        ], 
        error: null 
      }),
      insert: jest.fn().mockResolvedValue({ error: null })
    })
  }
}));

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: (str: string) => str
}));

describe('Journal Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it('renders the journal interface properly', async () => {
    render(<JournalPage />);
    
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
    expect(screen.getByText('AI Coach for Competitive Exams')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Hello AI')).toBeInTheDocument();
      expect(screen.getByText('Hello User')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText('Journal Entry')).toBeInTheDocument();
  });
});
