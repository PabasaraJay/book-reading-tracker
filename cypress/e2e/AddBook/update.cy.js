describe('Update Book Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navigate to Add Book page
    cy.visit('http://localhost:3000/add-book');
  });

  it('successfully updates a book', () => {
    // First add a book to update
    cy.get('input[name="title"]').type('Test Book');
    cy.get('input[name="author"]').type('Test Author');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('input[name="seriesName"]').type('Test Series');
    cy.get('select[name="edition"]').select('1st Edition');
    cy.get('input[name="pages"]').type('250');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--015').first().click();
    cy.get('button').contains(/Add Book/i).click();
    
    cy.get('button').contains(/Edit/i).click();

    // Now update the book
    cy.get('input[name="title"]').clear().type('Updated Title');
    cy.get('input[name="author"]').clear().type('Updated Author');
    cy.get('select[name="genre"]').select('Science Fiction');
    cy.get('input[value="English"]').check();
    cy.get('input[name="seriesName"]').clear().type('Updated Series');
    cy.get('select[name="edition"]').select('3rd Edition');
    cy.get('input[name="pages"]').clear().type('300');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--020').first().click();
    
    // Submit the update
    cy.get('button').contains(/Update Book/i).click();
    
    // Verify success message and updated details
    cy.contains('Book updated successfully!');
    cy.contains('Updated Title');
    cy.contains('Updated Author');
  });

}); 