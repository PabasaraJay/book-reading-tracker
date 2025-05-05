describe('Calendar Date Highlighting Test', () => {
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

    it('TC8: Should highlight dates with saved quotes in calendar', () => {
        const quote = 'Quote for calendar test';
        
        // Add a quote
        cy.get('select').select(1);
        cy.get('input[type="number"]').type('42');
        cy.get('textarea[placeholder="Enter your quote..."]').type(quote);
        cy.get('textarea[placeholder="Add a note about this quote..."]').type('Test note');
        cy.get('input[type="radio"][value="positive"]').check();
        cy.contains('Add Quote').click();
        
        // Open the date picker
        cy.get('.react-datepicker__input-container input').click();
        
        // Check if today's date is highlighted in the calendar
        cy.get('.react-datepicker__day--selected')
          .should('have.class', 'react-datepicker__day--highlighted');
    });
}); 