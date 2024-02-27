import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ContactSelector from './ContactSelector';

jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('ContactSelector', () => {
  it('renders without crashing', () => {
    render(<ContactSelector loadProducts={() => {}} />);
  });

  it('updates search value on change', () => {
    const { getByPlaceholderText } = render(
      <ContactSelector loadProducts={() => {}} />
    );

    const searchInput = getByPlaceholderText('Search by Name/SKU');
    fireEvent.change(searchInput, { target: { value: 'Company' } });

    expect(searchInput.value).toBe('Company');
  });

  it('resets search value on button click', () => {
    const { getByPlaceholderText, getByText } = render(
      <ContactSelector loadProducts={() => {}} />
    );

    const searchInput = getByPlaceholderText('Search by Name/SKU');
    fireEvent.change(searchInput, { target: { value: 'Company' } });

    const resetButton = getByText('Reset');
    fireEvent.click(resetButton);

    expect(searchInput.value).toBe('');
  });
});
