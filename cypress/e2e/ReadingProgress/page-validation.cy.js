describe('Page Count Validation', () => {
    beforeEach(() => {
        // Clear session data
        cy.clearLocalStorage();
        cy.clearCookies();
        
        // Login
        cy.visit('/login');
        cy.get('[data-testid="username"]').type('admin');
        cy.get('[data-testid="password"]').type('1234');
        cy.get('[data-testid="submit-login"]').click();
        
        // Navigate to reading progress page
        cy.visit('/reading-progress');
        
        // Wait for the form to be visible and book selection to be available
        cy.get('.reading-progress', { timeout: 10000 }).should('be.visible');
        cy.get('select#bookId', { timeout: 10000 }).should('be.visible');
    });

    it('should show validation error when submitting empty form', () => {
        // Select a book
        cy.get('select#bookId').select('1', { force: true });
        
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
        cy.get('select#bookId').select('1', { force: true });
        
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

    // it('should show validation error for page number exceeding total pages', () => {
    //     // Select a book
    //     cy.get('select#bookId').select('1', { force: true }); // The Hobbit (310 pages)
        
    //     // Wait for the form to be interactive
    //     cy.get('input[name="currentPage"]', { timeout: 5000 }).should('be.visible');
        
    //     // Enter page number exceeding total pages
    //     cy.get('input[name="currentPage"]').clear().type('311');
        
    //     // Click Save Progress button
    //     cy.get('button[type="submit"]').click();
        
    //     // Debug: Log the form state
    //     cy.get('.form-group input[name="currentPage"]').parent().then($el => {
    //         cy.log('Form group classes:', $el.attr('class'));
    //     });
        
    //     // Check for error message directly
    //     cy.get('.form-group input[name="currentPage"]').parent()
    //         .find('.error-message', { timeout: 10000 })
    //         .should('exist')
    //         .and('be.visible')
    //         .and('contain', 'Value must be less than or equal to 310');
            
    //     // Verify the form is not submitted
    //     cy.get('.toast.success').should('not.exist');
    // });

    it('should show validation error for non-numeric page number', () => {
        // Select a book
        cy.get('select#bookId').select('1', { force: true });
        
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

    

    it('should accept valid page number within range', () => {
        // Select a book
        cy.get('select#bookId').select('1', { force: true });
        
        // Wait for the form to be interactive
        cy.get('input[name="currentPage"]', { timeout: 5000 }).should('be.visible');
        
        // Enter valid page number
        cy.get('input[name="currentPage"]').type('50');
        
        // Set dates
        cy.get('.react-datepicker-wrapper').first().click();
        cy.get('.react-datepicker__day--028').click();
        cy.get('.react-datepicker-wrapper').last().click();
        cy.get('.react-datepicker__navigation--next').click();
        cy.get('.react-datepicker__day--001').click();
        
        // Select reading device
        cy.get('input[value="paper"]').check();
        
        // Add a comment
        cy.get('textarea[name="comment"]').type('Enjoying the adventure');
        
        // Submit form
        cy.get('button[type="submit"]').click();
        
        // Verify success message
        cy.get('.toast.success', { timeout: 5000 }).should('be.visible')
            .and('contain', 'Reading progress saved successfully!');
            
        // Verify the entry is displayed with correct page number
        cy.get('.entry-card').should('have.length', 1);
        cy.get('.entry-card').first().within(() => {
            cy.get('.current-page').should('contain', 'Page 50 of 310');
        });
    });
}); 