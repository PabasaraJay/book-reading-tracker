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

  it('should save a reading progress entry', () => {
    cy.get('select[name="bookId"]').select('1');
    cy.get('input[name="currentPage"]').type('50');
    cy.get('.react-datepicker-wrapper').first().click();
    cy.get('.react-datepicker__day--028').click();
    cy.get('.react-datepicker-wrapper').last().click();
    cy.get('.react-datepicker__navigation--next').click();
    cy.get('.react-datepicker__day--001').click();
    cy.get('input[value="paper"]').check();
    cy.get('textarea[name="comment"]').type('Enjoying the magical world of Harry Potter');
    cy.get('button').contains('Save Progress').click();
    cy.get('.toast.success').should('contain', 'Reading progress saved successfully!');
 
    cy.get('.edit-btn').first().click();
    cy.get('input[name="currentPage"]').clear().type('100');
    cy.get('button').contains('Update Progress').click();
    cy.get('.toast.success').should('contain', 'Reading progress updated successfully!');
  });
});