import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders a button with text', () => {
    render(<Button>Click Me</Button>)
    const buttonElement = screen.getByRole('button', { name: /click me/i })
    expect(buttonElement).toBeInTheDocument()
  })

  it('applies the correct variant class', () => {
    render(<Button variant="destructive">Delete</Button>)
    const buttonElement = screen.getByRole('button', { name: /delete/i })
    expect(buttonElement).toHaveClass('bg-destructive')
  })
})
