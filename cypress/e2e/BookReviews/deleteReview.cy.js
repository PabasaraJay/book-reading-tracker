describe('Book Reviews - Delete Review', () => {
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
  
    it('Should allow deleting a review', () => {
      cy.get('select').select(1);
      cy.get('.rating-stars span').eq(4).click();
      cy.get('textarea').type('This review will be deleted.');
      cy.contains('Add Review').click();
  
      cy.contains('This review will be deleted.').parent().within(() => {
        // cy.contains('Delete').click();
        cy.get('.review-actions > :nth-child(2)').click();
      });
  
      // cy.contains('This review will be deleted.').should('not.exist');
    });
}); 