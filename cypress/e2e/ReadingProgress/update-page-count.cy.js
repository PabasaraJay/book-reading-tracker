describe('Save Reading Progress', () => {
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

  it('should save a reading progress entry', () => {
    cy.get('select').select(1);    
    cy.get('input[name="currentPage"]').type('50');
    cy.get('.react-datepicker-wrapper').first().click();
    cy.get('.react-datepicker__day--002').click();
    cy.get('.react-datepicker-wrapper').last().click();
    cy.get('.react-datepicker__navigation--next').click();
    cy.get('.react-datepicker__day--006').click();
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