import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/Conquer Your Exams/i)
  })

  it('renders the Get Started button', () => {
    render(<Home />)
    const button = screen.getByRole('link', { name: /Get Started/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/signup')
  })
})
