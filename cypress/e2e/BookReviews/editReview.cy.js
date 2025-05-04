describe('Book Reviews - Edit Review', () => {
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
  
    it('Should allow editing a review', () => {
      cy.get('select').select(1);
      cy.get('.rating-stars span').eq(3).click();
      cy.get('textarea').type('Editing test review.');
      cy.contains('Add Review').click();
  
      cy.contains('Editing test review.').parent().within(() => {
        cy.contains('Edit').click();
      });
  
      cy.get('textarea').clear().type('Updated the review comment.');
      cy.contains('Update Review').click();
  
      cy.contains('Updated the review comment.').should('exist');
    });
}); 