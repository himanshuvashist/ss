import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ContactSelector from './ContactSelector';
import { listPurchasesContacts } from '../../../../services/contacts';

// Mock listPurchasesContacts function
jest.mock('../../../../services/contacts', () => ({
    listPurchasesContacts: jest.fn(() =>
        Promise.resolve({ data: { results: [] } })
    )
}));

describe('ContactSelector component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data when searching', async () => {
        const loadProductsMock = jest.fn();
        const { getByPlaceholderText } = render(
            <ContactSelector loadProducts={loadProductsMock} />
        );
        const searchInput = getByPlaceholderText('Search by Name/SKU');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        await waitFor(() =>
            expect(listPurchasesContacts).toHaveBeenCalledTimes(1)
        );
        expect(loadProductsMock).not.toHaveBeenCalled(); // Since loadProducts is not called in this scenario
    });

    it('should fetch data when focused', async () => {
        const loadProductsMock = jest.fn();
        const { getByPlaceholderText } = render(
            <ContactSelector loadProducts={loadProductsMock} />
        );
        const searchInput = getByPlaceholderText('Search by Name/SKU');
        fireEvent.focus(searchInput);
        await waitFor(() =>
            expect(listPurchasesContacts).toHaveBeenCalledTimes(1)
        );
        expect(loadProductsMock).not.toHaveBeenCalled(); // Since loadProducts is not called in this scenario
    });

    it('should fetch data when an option is selected', async () => {
        const loadProductsMock = jest.fn();
        const { getByPlaceholderText, getByText } = render(
            <ContactSelector loadProducts={loadProductsMock} />
        );
        const searchInput = getByPlaceholderText('Search by Name/SKU');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        await waitFor(() =>
            expect(listPurchasesContacts).toHaveBeenCalledTimes(1)
        );

        // Mock response data
        const optionText = 'Option 1';
        const option = getByText(optionText);
        fireEvent.click(option);

        // Assert that loadProducts was called with the correct option
        expect(loadProductsMock).toHaveBeenCalledWith({
            contact: 'Option 1',
            paginate: 'true'
        });
    });

    it('should reset search value and load products when reset button is clicked', async () => {
        const loadProductsMock = jest.fn();
        const { getByText, getByPlaceholderText } = render(
            <ContactSelector loadProducts={loadProductsMock} />
        );
        const searchInput = getByPlaceholderText('Search by Name/SKU');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        await waitFor(() =>
            expect(listPurchasesContacts).toHaveBeenCalledTimes(1)
        );

        // Click reset button
        const resetButton = getByText('Reset');
        fireEvent.click(resetButton);

        // Assert that search value is reset and loadProducts is called with empty object
        expect(searchInput.value).toBe('');
        expect(loadProductsMock).toHaveBeenCalledWith({});
    });
});
