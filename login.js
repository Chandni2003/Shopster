// Get form elements
const toSignUp = document.getElementById('to-signup');
const toLogin = document.getElementById('to-login');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Switch to sign-up form
toSignUp.addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.classList.remove('active');
  signupForm.classList.add('active');
});

// Switch to login form
toLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.classList.remove('active');
  loginForm.classList.add('active');
});

// Handle Login Form Submission
loginForm.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get user credentials
  const email = document.getElementById('login-email').value.trim(); 
  const password = document.getElementById('login-password').value.trim(); 
  
  // Retrieve stored user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  
  if (userData && userData.email === email && userData.password === password) {
    // Login successful
    alert('Login successful');
    // Store logged-in status
    userData.loggedIn = true;
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Redirect to homepage
    window.location.href = 'index.html';  
  } else {
    alert('Invalid email or password');
  }
});

// Handle Sign Up Form Submission
signupForm.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Get user details
  const name = document.getElementById('signup-name').value.trim(); 
  const email = document.getElementById('signup-email').value.trim(); 
  const password = document.getElementById('signup-password').value.trim(); 
  
  // Save user data to localStorage
  const userData = {
    name,
    email,
    password,
    loggedIn: true,
  };
  
  // Store user data in localStorage
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Display success message and redirect
  alert('Sign up successfuly');
  window.location.href = 'index.html';  
});

//event listener for "Back to Home" button
document.getElementById('back-to-home').addEventListener('click', () => {
  // Redirect to the home page
  window.location.href = 'index.html';  
});

