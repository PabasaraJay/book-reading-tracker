describe('Quote Editing Test', () => {
    beforeEach(() => {
        // First visit the login page
        cy.visit('http://localhost:3000/login');
        
        // Login with credentials
        cy.get('input#username').type('admin');
        cy.get('input#password').type('1234');
        cy.get('form').submit();
        
        // Wait for login to complete and redirect
        cy.url().should('eq', 'http://localhost:3000/');
        
        // Navigate to QuoteCollection page
        cy.visit('http://localhost:3000/quote-collection');
    });

    it('TC6: Should edit an existing quote', () => {
        const originalQuote = 'Original quote text';
        const editedQuote = 'Edited quote text';
        
        // Add the original quote
        cy.get('select').select(1);
        cy.get('input[type="number"]').type('42');
        cy.get('textarea[placeholder="Enter your quote..."]').type(originalQuote);
        cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
        cy.get('input[type="radio"][value="positive"]').check();
        
        // Wait for the button to be enabled and click it
        cy.contains('Add Quote').should('not.be.disabled').click();
        
        // Wait for the quote to appear in the list
        cy.get('.quotes-list').should('be.visible');
        cy.get('.quote-item').should('contain', originalQuote);
        
        // Edit the quote
        cy.get('.quote-item').first().find('.edit').click();
        
        // Update all required fields
        cy.get('select').should('have.value', '1');
        cy.get('input[type="number"]').clear().type('42');
        cy.get('textarea[placeholder="Enter your quote..."]').clear().type(editedQuote);
        cy.get('textarea[placeholder="Add a note about this quote..."]').clear().type('Updated note');
        cy.get('input[type="radio"][value="positive"]').check();
        
        // Wait for the update button to be enabled and click it
        cy.contains('Update Quote').should('not.be.disabled').click();
        
        // Verify the quote was updated
        cy.get('.quotes-list').should('contain', editedQuote);
        cy.get('.quotes-list').should('not.contain', originalQuote);
    });
}); 