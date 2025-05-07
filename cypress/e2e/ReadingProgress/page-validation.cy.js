describe('Page Count Validation', () => {
    beforeEach(() => {
        // Clear session data
        cy.clearLocalStorage();
        cy.clearCookies();
        
        // Login
        cy.visit('http://localhost:3000/login');
        cy.get('input#username').type('admin');
        cy.get('input#password').type('1234');
        cy.get('form').submit();
            
            // Wait for login to complete and redirect
        cy.url().should('eq', 'http://localhost:3000/');
            
        // Navigate to reading progress page
        cy.visit('http://localhost:3000/reading-progress');
        
        // Wait for the form to be visible and book selection to be available
        cy.get('.reading-progress', { timeout: 10000 }).should('be.visible');
        cy.get('select#bookId', { timeout: 10000 }).should('be.visible');
    });

    it('should show validation error when submitting empty form', () => {
        // Select a book
        cy.get('select').select(1);    
        
        // Wait for the form to be interactive
        cy.get('input[name="currentPage"]', { timeout: 5000 }).should('be.visible');
        
        // Try to submit without entering any data
        cy.get('button[type="submit"]').click();
        
        // Wait for error message to appear
        cy.get('.form-group input[name="currentPage"]').parent()
            .find('.error-message', { timeout: 5000 })
            .should('be.visible')
            .and('contain', 'Current page must be greater than 0');
    });

    it('should show validation error for zero page number', () => {
        // Select a book
        cy.get('select').select(1);    
        
        // Wait for the form to be interactive
        cy.get('input[name="currentPage"]', { timeout: 5000 }).should('be.visible');
        
        // Enter zero page number
        cy.get('input[name="currentPage"]').type('0');
        
        // Click Save Progress button
        cy.get('button[type="submit"]').click();
        
        // Check for error message after form submission
        cy.get('.form-group input[name="currentPage"]').parent()
            .find('.error-message')
            .should('be.visible')
            .and('contain', 'Current page must be greater than 0');
    });

    it('should show validation error for non-numeric page number', () => {
        // Select a book
        cy.get('select').select(1);    
        
        // Wait for the form to be interactive
        cy.get('input[name="currentPage"]', { timeout: 5000 }).should('be.visible');
        
        // Enter non-numeric value
        cy.get('input[name="currentPage"]').type('abc');
        
        // Click Save Progress button
        cy.get('button[type="submit"]').click();
        
        // Check for error message after form submission
        cy.get('.form-group input[name="currentPage"]').parent()
            .find('.error-message', { timeout: 10000 })
            .should('be.visible')
            .and('contain', 'Current page must be greater than 0');
    });

}); 