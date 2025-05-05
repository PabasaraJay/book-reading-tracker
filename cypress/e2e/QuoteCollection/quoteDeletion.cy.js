describe('Quote Deletion Test', () => {
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

    it('TC7: Should delete an existing quote', () => {
        const quote = 'Quote to be deleted';
        
        // Add the quote
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
        
        // Delete the quote
        cy.get('.quote-item').first().find('.delete').click();
        
        // Confirm deletion in the confirmation dialog
        cy.on('window:confirm', (str) => {
            expect(str).to.equal('Are you sure you want to delete this quote?');
            return true;
        });
        
        // Wait for the quote to be removed from the list
        cy.get('.quotes-list').should('not.contain', quote);
        
        // Verify the list is empty or doesn't contain our quote
        cy.get('.quotes-list').then(($list) => {
            if ($list.find('.quote-item').length > 0) {
                cy.get('.quote-item').should('not.contain', quote);
            } else {
                cy.get('.empty-message').should('be.visible');
            }
        });
    });
}); 