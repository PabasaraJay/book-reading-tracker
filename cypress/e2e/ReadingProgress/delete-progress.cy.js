describe('Delete Reading Progress', () => {
  beforeEach(() => {
    // Clear session data
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Login
    cy.visit('http://localhost:3000/login');
    cy.get('[data-testid="username"]').type('admin');
    cy.get('[data-testid="password"]').type('1234');
    cy.get('[data-testid="submit-login"]').click();
    
    // Navigate to reading progress page
    cy.visit('/reading-progress');
    
    // Wait for the form to be visible
    cy.get('.reading-progress').should('be.visible');
  });

  it('should delete a reading progress entry', () => {
    // First, create a new entry to delete
    // Select Harry Potter book
    cy.get('select[name="bookId"]').select('1');
    
    // Fill in current reading page
    cy.get('input[name="currentPage"]').type('50');
    
    // Set reading start date to 28th April 2025
    cy.get('.react-datepicker-wrapper').first().click();
    cy.get('.react-datepicker__day--028').click();
    
    // Set target completion date to 1st May 2025
    cy.get('.react-datepicker-wrapper').last().click();
    // First click the next month button to go to May
    cy.get('.react-datepicker__navigation--next').click();
    // Then select the 1st day
    cy.get('.react-datepicker__day--001').click();
    
    // Select reading device as paper
    cy.get('input[value="paper"]').check();
    
    // Add a comment about the reading progress
    cy.get('textarea[name="comment"]').type('Enjoying the magical world of Harry Potter');
    
    // Click Save Progress button
    cy.get('button').contains('Save Progress').click();
    
    // Verify success message appears
    cy.get('.toast.success').should('be.visible')
      .and('contain', 'Reading progress saved successfully!');

    // Now test the delete functionality
    // Wait for the entry to appear in the list
    cy.get('.entries-list').should('be.visible');
    
    // Click the delete button for the first entry
    cy.get('.delete-btn').first().click();
    
    // Handle the confirmation dialog
    cy.on('window:confirm', (str) => {
      expect(str).to.equal('Are you sure you want to delete this entry?');
      return true;
    });
    
    // Verify success message for deletion
    cy.get('.toast.success').should('be.visible')
      .and('contain', 'Entry deleted successfully!');
    
    
  });
}); 