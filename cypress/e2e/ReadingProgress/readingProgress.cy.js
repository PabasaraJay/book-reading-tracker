describe('Reading Progress Form', () => {
  beforeEach(() => {
    // Clear any existing session data
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Visit login page and login
    cy.visit('http://localhost:3000/login');
    cy.get('input#username').type('admin');
    cy.get('input#password').type('1234');
    cy.get('form').submit();
        
        // Wait for login to complete and redirect
    cy.url().should('eq', 'http://localhost:3000/');
        
    // Navigate to reading progress page
    cy.visit('http://localhost:3000/reading-progress');
  });

  it('should display reading progress form', () => {
    // Verify form title and description
    cy.get('.form-content .form-title h1').should('contain', 'Track Your Reading');
    cy.get('.form-content .form-title p').should('contain', 'Keep track of your reading journey and progress');

    // Verify form fields
    cy.get('select#bookId').should('be.visible');
  });

  it('should show submit button after selecting a book', () => {
    // Select a book
    cy.get('select').select(1);    
    
    // Verify submit button is visible after selecting a book
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Save Progress');
  });

  it('should allow selecting a book and entering page number', () => {
    // Select a book
    cy.get('select').select(1);        
    // Verify current page input is visible after selecting a book
    cy.get('input#currentPage').should('be.visible');
    
    // Enter page number
    cy.get('input#currentPage').type('50');
    cy.get('input#currentPage').should('have.value', '50');
  });

  it('should allow entering a comment', () => {
    // Select a book first
    cy.get('select').select(1);    
    
    // Enter comment
    cy.get('textarea#comment').type('Test reading progress entry');
    cy.get('textarea#comment').should('have.value', 'Test reading progress entry');
  });

  it('should show validation errors for required fields', () => {
    // Try to submit without selecting a book
    cy.get('select').select(1);    
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('contain', 'Current page must be greater than 0');
    
    // Enter invalid page number
    cy.get('input#currentPage').type('0');
    cy.get('button[type="submit"]').click();
    cy.get('.error-message').should('contain', 'Current page must be greater than 0');
  });
}); 