describe('Book Reviews - Add Valid Review', () => {
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
  
    it('Should add a valid review', () => {
      cy.get('select').select(1);
      cy.get('.rating-stars span').eq(4).click(); // 5-star
      cy.get('textarea').type('Amazing book! Really loved the character development.');
      cy.contains('Add Review').click();
      cy.contains('Your review for').should('exist');
      cy.contains('Amazing book!').should('exist');
    });
}); 