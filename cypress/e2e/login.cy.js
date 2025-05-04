describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:3000/login'); // Adjust the path if different
    });
  
    it('should log in successfully with correct credentials', () => {
      cy.get('input#username').type('admin');
      cy.get('input#password').type('1234');
      cy.get('form').submit();
  
      // You can assert that it redirects to homepage or stores auth
      cy.url().should('eq', 'http://localhost:3000/');
      cy.window().then((win) => {
        expect(win.localStorage.getItem('isAuthenticated')).to.eq('true');
      });
    });
  
    it('should display an error for invalid credentials', () => {
      cy.get('input#username').type('wronguser');
      cy.get('input#password').type('wrongpass');
      cy.get('form').submit();
  
      cy.get('.login-error-message').should('contain', 'Invalid username or password');
      cy.url().should('include', '/login');
    });
  
    it('should not allow empty fields', () => {
      cy.get('form').submit();
      cy.get('input#username:invalid').should('have.length', 1);
      cy.get('input#password:invalid').should('have.length', 1);
    });
  });
  