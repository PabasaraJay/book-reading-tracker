describe('Book Reviews - Long Comment Error', () => {
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
  
    it('Should not allow comments over 250 characters', () => {
      cy.get('select').select(1);
      cy.get('.rating-stars span').eq(4).click();
      const longComment = 'A'.repeat(251);
      cy.get('textarea').type(longComment);
      cy.contains('Add Review').click();
      cy.get('.error-message').should('contain', 'Review cannot exceed');
    });
}); 