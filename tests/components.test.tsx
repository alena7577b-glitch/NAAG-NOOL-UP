import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { QuantityStepper } from '@/components/commerce/QuantityStepper';
import { ProductCard } from '@/components/commerce/ProductCard';

describe('Phase 2 Reusable Design System Component Tests', () => {
  describe('Button Component', () => {
    test('renders with primary variant and text content', () => {
      render(<Button variant="primary">Shop the Journals</Button>);
      const button = screen.getByRole('button', { name: /shop the journals/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-[#B85233]');
    });

    test('handles click events when enabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      fireEvent.click(screen.getByRole('button', { name: /click me/i }));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('is disabled when disabled prop is true', () => {
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled Action
        </Button>
      );
      const button = screen.getByRole('button', { name: /disabled action/i });
      expect(button).toBeDisabled();
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('shows loading indicator when isLoading is true', () => {
      render(<Button isLoading>Submit</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });
  });

  describe('QuantityStepper Component', () => {
    test('renders current value', () => {
      const handleChange = jest.fn();
      render(<QuantityStepper value={3} onChange={handleChange} />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    test('calls onChange with incremented value on plus click', () => {
      const handleChange = jest.fn();
      render(<QuantityStepper value={1} onChange={handleChange} min={1} max={10} />);
      const plusBtn = screen.getByRole('button', { name: /increase quantity/i });
      fireEvent.click(plusBtn);
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    test('calls onChange with decremented value on minus click', () => {
      const handleChange = jest.fn();
      render(<QuantityStepper value={3} onChange={handleChange} min={1} max={10} />);
      const minusBtn = screen.getByRole('button', { name: /decrease quantity/i });
      fireEvent.click(minusBtn);
      expect(handleChange).toHaveBeenCalledWith(2);
    });

    test('disables minus button when value is at min', () => {
      const handleChange = jest.fn();
      render(<QuantityStepper value={1} onChange={handleChange} min={1} max={10} />);
      const minusBtn = screen.getByRole('button', { name: /decrease quantity/i });
      expect(minusBtn).toBeDisabled();
    });
  });

  describe('Badge Component', () => {
    test('renders in-stock badge with dot indicator', () => {
      render(<Badge variant="inStock">In Stock</Badge>);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    test('renders custom variant classes', () => {
      render(<Badge variant="terracotta">Featured</Badge>);
      const badge = screen.getByText('Featured').parentElement;
      expect(badge).toHaveClass('bg-[#B85233]');
    });
  });

  describe('ProductCard Component', () => {
    const mockProduct = {
      id: 'prod-1',
      title: 'The Clarity',
      slug: 'the-clarity',
      description: 'A guided journal to help you find your direction.',
      price: 24.0,
      category: 'Healing & Growth',
      isAvailable: true,
    };

    test('renders product information correctly', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByRole('heading', { name: 'The Clarity' })).toBeInTheDocument();
      expect(screen.getByText('Healing & Growth')).toBeInTheDocument();
      expect(screen.getByText('$24.00')).toBeInTheDocument();
      expect(screen.getByText('In Stock')).toBeInTheDocument();
    });

    test('fires onAddToCart callback when Add to Cart button is clicked', () => {
      const handleAddToCart = jest.fn();
      render(<ProductCard product={mockProduct} onAddToCart={handleAddToCart} />);
      const addBtn = screen.getByRole('button', { name: /add to (bag|cart)/i });
      fireEvent.click(addBtn);
      expect(handleAddToCart).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe('Container Component', () => {
    test('renders children inside max-width container', () => {
      render(
        <Container size="default">
          <div data-testid="child-element">Content</div>
        </Container>
      );
      expect(screen.getByTestId('child-element')).toBeInTheDocument();
    });
  });
});
