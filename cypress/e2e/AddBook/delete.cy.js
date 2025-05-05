describe('Delete Book Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navigate to Add Book page
    cy.visit('http://localhost:3000/add-book');
  });

  it('successfully deletes a book', () => {
    // First add a book to delete
    cy.get('input[name="title"]').type('Book to Delete');
    cy.get('input[name="author"]').type('Test Author');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('input[name="seriesName"]').type('Test Series');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--005').first().click();
    cy.get('select[name="edition"]').select('1st Edition');
    cy.get('input[name="pages"]').type('250');
    cy.get('button').contains(/Add Book/i).click();
    
    // Now delete the book
    cy.get('button').contains(/Delete/i).click();
    
    // Verify success message and that the book is no longer visible
    cy.contains('Book deleted successfully!');
  });

});