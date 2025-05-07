describe('Filter Books Test', () => {
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
        
        // Wait for the form to be visible
        cy.get('.reading-progress').should('be.visible');
    });

    it('should test filter and search functionality for reading progress', () => {
        // Add first book (The Hobbit)
        cy.get('select').select(1);    
        cy.get('.react-datepicker-wrapper').first().click();
        cy.get('.react-datepicker__day--003').click();
        
        // Set target completion date to 1st May 2025
        cy.get('.react-datepicker-wrapper').last().click();
        cy.get('.react-datepicker__navigation--next').click();
        cy.get('.react-datepicker__day--007').click();
        cy.get('input[name="currentPage"]').type('75');
        
        // Select reading device as paper
        cy.get('input[value="paper"]').check();
        
        // Add a comment
        cy.get('textarea[name="comment"]').type('Enjoying the adventure');
        
        // Save progress
        cy.get('button').contains('Save Progress').click();
        cy.get('.toast.success').should('be.visible')
            .and('contain', 'Reading progress saved successfully!');

        // Add second book (Harry Potter)
        cy.get('select').select(2);    
        cy.get('.react-datepicker-wrapper').first().click();
        cy.get('.react-datepicker__day--002').click();
        
        // Set target completion date to 1st May 2025
        cy.get('.react-datepicker-wrapper').last().click();
        cy.get('.react-datepicker__navigation--next').click();
        cy.get('.react-datepicker__day--006').click();
        cy.get('input[name="currentPage"]').type('75');
        
        // Select reading device as paper
        cy.get('input[value="paper"]').check();
        
        // Add a comment
        cy.get('textarea[name="comment"]').type('Enjoying the magical world of Harry Potter');
        
        // Save progress
        cy.get('button').contains('Save Progress').click();
        cy.get('.toast.success').should('be.visible')
            .and('contain', 'Reading progress saved successfully!');

        // Test search functionality with exact title
        cy.get('.search-input').type('The Hobbit{enter}');
        cy.get('.entries-list').should('be.visible');
        cy.get('.entry-card').should('have.length', 1);
        cy.get('.entry-card').first().within(() => {
            cy.get('h3').should('contain', 'The Hobbit');
            cy.get('.current-page').should('contain', 'Page 75');
        });

        // Test search with partial title
        cy.get('.search-input').clear().type('Hobbit{enter}');
        cy.get('.entry-card').should('have.length', 1);
        cy.get('.entry-card').first().within(() => {
            cy.get('h3').should('contain', 'The Hobbit');
        });

        // Test search with comment content
        cy.get('.search-input').clear().type('adventure{enter}');
        cy.get('.entry-card').should('have.length', 1);
        cy.get('.entry-card').first().within(() => {
            cy.get('h3').should('contain', 'The Hobbit');
            cy.get('.value').should('contain', 'Enjoying the adventure');
        });

        // Clear search and verify all entries are shown
        cy.get('.search-input').clear();
        cy.get('.entry-card').should('have.length', 2);

        // Test filter functionality
        cy.get('.filter-select').select('2'); // Select Harry Potter
        cy.get('.entry-card').should('have.length', 1);
        cy.get('.entry-card').first().within(() => {
            cy.get('h3').should('contain', 'Harry Potter and the Sorcerer\'s Stone');
            cy.get('.current-page').should('contain', 'Page 75');
        });
        cy.get('.history-summary').should('contain', 'Showing entries for: Harry Potter and the Sorcerer\'s Stone');

        // Test filter with search combination
        cy.get('.search-input').type('magical{enter}');
        cy.get('.entry-card').should('have.length', 1);
        cy.get('.entry-card').first().within(() => {
            cy.get('h3').should('contain', 'Harry Potter and the Sorcerer\'s Stone');
            cy.get('.current-page').should('contain', 'Page 75');
            cy.get('.value').should('contain', 'Enjoying the magical world of Harry Potter');
        });

        // Test filter with no results
        cy.get('.search-input').clear().type('non-existent{enter}');
        cy.get('.entry-card').should('not.exist');
        cy.get('.history-summary').should('contain', 'Total Entries: 0');

        // Clear all filters
        cy.get('.filter-select').select('');
        cy.get('.search-input').clear();
        cy.get('.entry-card').should('have.length', 2);
    });
}); 