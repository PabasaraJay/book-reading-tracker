describe('Book Reviews - Empty Comment Error', () => {
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
  
    it('Should show error for empty comment', () => {
      cy.get('select').select(1);
      cy.get('.rating-stars span').eq(4).click(); // 5-star
      cy.contains('Add Review').click();
      cy.get('.error-message').should('contain', 'Review cannot be blank');
    });
}); 