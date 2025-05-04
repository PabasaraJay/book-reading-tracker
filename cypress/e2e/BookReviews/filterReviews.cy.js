describe('Book Reviews - Filter Reviews', () => {
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
  
    it('Should filter reviews based on search term', () => {
      cy.get('select').select(1);
      cy.get('.rating-stars span').eq(3).click(); // 4-star
      cy.get('textarea').type('Beautiful storytelling.');
      cy.contains('Add Review').click();
  
      cy.get('input[placeholder="Search reviews..."]').type('story');
      cy.contains('Beautiful storytelling.').should('exist');
  
      cy.get('input[placeholder="Search reviews..."]').clear().type('nonexistent');
      cy.contains('Add Your Reviews to See Them Here!').should('exist');
    });
}); 