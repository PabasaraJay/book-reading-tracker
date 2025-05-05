describe('Add Book Success Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
    cy.url().should('eq', 'http://localhost:3000/');
    
    // Navigate to Book Reviews page
    cy.visit('http://localhost:3000/add-book');
  });

  it('successfully adds a book', () => {
    cy.get('input[name="title"]').clear().type('Valid Title');
    cy.get('input[name="author"]').clear().type('Valid Author');
    cy.get('select[name="genre"]').select('Fantasy');
    cy.get('input[value="Sinhala"]').check();
    cy.get('input[name="seriesName"]').type('Magic Series');
    cy.get('select[name="edition"]').select('2nd Edition');
    cy.get('input[name="pages"]').type('250');
    cy.get('.date-picker').click();
    cy.get('.react-datepicker__day--005').first().click();
    cy.get('button').contains(/Add Book/i).click();
    cy.contains('Book added successfully!');
    cy.contains('Valid Title');
    cy.contains('Valid Author');
  });
}); 