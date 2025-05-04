describe('Book Reviews - No Rating Error', () => {
    beforeEach(() => {
      // Login first
      cy.visit('http://localhost:3000/login');
      cy.get('input#username').type('admin');
      cy.get('input#password').type('1234');
      cy.get('form').submit();
      cy.url().should('eq', 'http://localhost:3000/');
      
      // Navigate to Book Reviews page
      cy.visit('http://localhost:3000/book-reviews');
    });
  
    it('Should show error if no rating is selected', () => {
      cy.get('select').select(1);
      cy.get('textarea').type('This is a decent book.');
      cy.contains('Add Review').click();
      cy.get('.error-message').should('contain', 'Please select a valid rating');
    });
}); 