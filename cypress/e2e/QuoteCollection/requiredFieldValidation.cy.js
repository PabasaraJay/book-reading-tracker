describe('Required Field Validation', () => {
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

    it('should show error messages for missing required fields', () => {
        // Interact with each field to trigger validation
        cy.get('select').focus().blur();
        cy.get('input[type="number"]').focus().blur();
        cy.get('textarea[placeholder="Enter your quote..."]').focus().blur();
        
        // Try to add quote without filling any fields
        cy.contains('Add Quote').click({ force: true });
        
        // Wait for the form to be invalid
        cy.contains('Add Quote').should('be.disabled');
        
        // Verify error messages for each field
        cy.get('select').parent().find('.error-message').should('be.visible')
          .and('contain', 'Please select a book');
        
        cy.get('input[type="number"]').parent().find('.error-message').should('be.visible')
          .and('contain', 'Please enter a valid page number');
        
        cy.get('textarea[placeholder="Enter your quote..."]').parent().find('.error-message').should('be.visible')
          .and('contain', 'Quote cannot be empty');
    });
}); 