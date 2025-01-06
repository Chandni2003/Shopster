// Fetch Cart from Local Storage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Cart Products
function displayCart() {
  const cartPage = document.getElementById('cart-page');
  cartPage.innerHTML = ''; 

  if (cart.length === 0) {
    cartPage.innerHTML = '<p>Your cart is empty!</p>';
    return;
  }

  cart.forEach(product => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="cart-item-details">
        <p class="cart-item-name">${product.name}</p>
        <p class="cart-item-price">${product.price}</p>
      </div>
      <button class="cart-item-remove" data-id="${product.id}">Remove</button>
    `;

    //  redirect to the home page with the product details
    cartItem.addEventListener('click', () => {
      // Store selected product in localStorage
      localStorage.setItem('selectedProduct', JSON.stringify(product));
      // Redirect to the home page
      window.location.href = 'index.html';
    });

    cartPage.appendChild(cartItem);
  });

  // Add Remove Button Functionality
  const removeButtons = document.querySelectorAll('.cart-item-remove');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation(); 
      const productId = e.target.dataset.id;
      cart = cart.filter(product => product.id !== productId); 
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart(); 
    });
  });
}

// Initialize Cart Page
document.addEventListener('DOMContentLoaded', displayCart);

// Function to update the cart counter
function updateCartCounter() {
  const cartCount = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount.textContent = cart.length;
}

// Call this function on both the cart and home pages after loading the content
document.addEventListener('DOMContentLoaded', updateCartCounter);
