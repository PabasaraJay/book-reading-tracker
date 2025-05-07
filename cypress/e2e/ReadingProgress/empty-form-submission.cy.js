describe('Empty Form Submission Test', () => {
  it('should show error when submitting empty form after selecting a book', () => {
    // Step 1: Login
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
        
        // Wait for login to complete and redirect
    cy.url().should('eq', 'http://localhost:3000/');
        
    // Navigate to reading progress page
    cy.visit('http://localhost:3000/reading-progress');

    // Step 3: Select a book
    cy.get('select').select(1);    

    // Step 4: Click Save Progress button
    cy.get('button').contains('Save Progress').click();

    // Step 5: Verify error message
    cy.get('.error-message').should('be.visible')
      .and('contain', 'Current page must be greater than 0');
  });
}); 