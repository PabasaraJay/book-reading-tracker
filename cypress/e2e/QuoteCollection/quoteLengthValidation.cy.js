describe('Quote Length Validation', () => {
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

    it('should not allow quotes longer than 500 characters', () => {
        // Fill in all required fields
        cy.get('select').select(1);
        cy.get('input[type="number"]').type('10');
        
        // Type a long quote and trigger validation
        const longQuote = 'A'.repeat(501);
        cy.get('textarea[placeholder="Enter your quote..."]')
          .type(longQuote)
          .blur(); // Trigger validation by removing focus
        
        cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
        cy.get('input[type="radio"][value="positive"]').check();
        
        // Wait for error message to appear
        cy.wait(1000);
        
        // Verify the error message appears
        cy.get('textarea[placeholder="Enter your quote..."]').next('.error-message').should('be.visible')
          .and('contain', 'Quote cannot exceed 500 characters');
        
        // Verify the Add Quote button is disabled
        cy.contains('Add Quote').should('be.disabled');
    });
}); 