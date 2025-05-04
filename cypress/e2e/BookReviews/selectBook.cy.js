describe('Book Reviews - Select Book', () => {
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
  
    it('Should allow selecting a book', () => {
      cy.get('select').select(1); // Select second book
      cy.get('.book-title h3').should('exist');
    });
}); 