import { render, screen } from '@testing-library/react';
import { Sidebar } from '@/components/Sidebar';

// Mock Next.js router/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Sidebar Component', () => {
  it('renders sidebar navigation links', () => {
    render(<Sidebar />);
    
    // Check if main navigation items are present by their ARIA attributes or text
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Tracker')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
  });

  it('renders logout button', () => {
    render(<Sidebar />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
});
