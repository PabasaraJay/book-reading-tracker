describe('Valid Quote Addition Test', () => {
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

    it('TC2: Should add a valid quote with all required fields', () => {
        const quote = 'So we beat on, boats against the current, borne back ceaselessly into the past.';
        const note = 'A beautiful metaphor about the human condition';
        
        // Fill in all required fields
        cy.get('select').select(1);
        cy.get('input[type="number"]').type('42');
        cy.get('textarea[placeholder="Enter your quote..."]').type(quote);
        cy.get('textarea[placeholder="Add a note about this quote..."]').type(note);
        cy.get('input[type="radio"][value="positive"]').check();
        
        // Wait for the button to be enabled and click it
        cy.contains('Add Quote').should('not.be.disabled').click();
        
        // Wait for the quote to appear in the list
        cy.get('.quotes-list').should('be.visible');
        cy.get('.quote-item').should('contain', quote);
        cy.get('.quote-item').should('contain', note);
    });
}); 