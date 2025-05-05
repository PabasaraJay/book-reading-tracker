describe('Save Reading Progress', () => {
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
    
    // Wait for the form to be visible
    cy.get('.reading-progress').should('be.visible');
  });

  it('should save progress with valid data for Harry Potter', () => {
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
  });
}); 