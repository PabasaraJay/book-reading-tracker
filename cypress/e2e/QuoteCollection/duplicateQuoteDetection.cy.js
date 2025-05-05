describe('Duplicate Quote Detection Test', () => {
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

    it('TC5: Should prevent adding duplicate quotes', () => {
        const quote = 'Test quote for duplication';
        
        // Add the quote first time
        cy.get('select').select(1);
        cy.get('input[type="number"]').type('42');
        cy.get('textarea[placeholder="Enter your quote..."]').type(quote);
        cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
        cy.get('input[type="radio"][value="positive"]').check();
        
        // Wait for the button to be enabled and click it
        cy.contains('Add Quote').should('not.be.disabled').click();
        
        // Wait for the quote to appear in the list
        cy.get('.quotes-list').should('be.visible');
        cy.get('.quote-item').should('contain', quote);
        
        // Clear the form and try to add the same quote again
        cy.get('textarea[placeholder="Enter your quote..."]').clear().type(quote);
        cy.get('input[type="number"]').clear().type('42');
        cy.get('select').select(1);
        cy.get('textarea[placeholder="Add a note about this quote..."]').clear().type('Test note');
        cy.get('input[type="radio"][value="positive"]').check();
        
        // Try to add the duplicate quote
        cy.contains('Add Quote').click({ force: true });
        
        // Verify the error message
        cy.get('.error-message').should('contain', 'This quote already exists');
    });
}); 