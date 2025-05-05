describe('Add Book Form Reset Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navigate to Book Reviews page
    cy.visit('http://localhost:3000/add-book');
  });

  it('clears form on reset', () => {
    cy.get('input[name="title"]').type('Book to Reset');
    cy.get('button').contains('Reset Form').click();
    cy.get('input[name="title"]').should('have.value', '');
  });
}); 