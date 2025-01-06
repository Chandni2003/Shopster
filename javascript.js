// Hamburger Menu Toggle
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebarMenu = document.getElementById('sidebar-menu');

hamburgerMenu.addEventListener('click', () => {
  sidebarMenu.classList.toggle('active'); // Toggle sidebar visibility
});

// Close Sidebar When Clicking Outside
document.addEventListener('click', (e) => {
  if (!sidebarMenu.contains(e.target) && !hamburgerMenu.contains(e.target)) {
    sidebarMenu.classList.remove('active'); // Hide the sidebar
  }
});

// Login Dropdown Toggle
const loginButton = document.getElementById('login-button');
const dropdownMenu = document.getElementById('dropdown-menu');
const loginArrow = document.getElementById('login-arrow');

loginButton.addEventListener('click', (e) => {
  e.preventDefault(); // default anchor behavior
  dropdownMenu.classList.toggle('active');
  loginArrow.classList.toggle('fa-caret-down');
  loginArrow.classList.toggle('fa-caret-up');
});

// Cart Functionality
let cart = [];
const cartIcon = document.getElementById('cart-icon');
const cartCount = document.getElementById('cart-count');

// Add Product to Cart
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').textContent;
    const productImage = productCard.querySelector('.main-image').src;
    const productId = productCard.dataset.id; // each product card has a unique data-id

    // Check if the product is already in the cart
    if (!cart.some(product => product.id === productId)) {
      const product = {
        id: productId,
        name: productName,
        price: productPrice,
        image: productImage
      };

      // Add to Cart Array
      cart.push(product);
      updateCart();
      // Highlight heart icon
      productCard.querySelector('.heart-icon').classList.add('added-to-cart');
    }
  });
});

// Update Cart Count and Save to LocalStorage
function updateCart() {
  cartCount.textContent = cart.length; // Update cart icon count
  localStorage.setItem('cart', JSON.stringify(cart)); // Save cart data
}

// Redirect to Cart Page
cartIcon.addEventListener('click', () => {
  window.location.href = 'cart.html'; // Redirect to cart page
});

// Buy Now Button 
const buyNowButtons = document.querySelectorAll('.buy-now');
buyNowButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    const productCard = e.target.closest('.product-card');
    const productName = productCard.querySelector('.product-name').textContent;
    const productPrice = productCard.querySelector('.product-price').childNodes[0].textContent.trim(); // Extract current price
    const oldPrice = productCard.querySelector('.old-price')?.textContent.trim() || ''; // Extract old price
    const productImage = productCard.querySelector('.main-image').src;

    // Populate the Order Form
    const orderForm = document.getElementById('order-form');
    const orderProductName = orderForm.querySelector('.order-product-name');
    const orderProductPrice = orderForm.querySelector('.order-product-price');

    // Update Form Content
    orderProductName.textContent = productName;
    orderProductPrice.innerHTML = `${productPrice} <span class="old-price">${oldPrice}</span>`; // both prices
    const orderProductImage = orderForm.querySelector('.order-product-image');
    orderProductImage.src = productImage;
    orderProductImage.style.display = 'block'; // Ensure the image is visible

    // Show Order Form Modal
    orderForm.style.display = 'flex';
  });
});

// Submit Order
const submitOrderButton = document.getElementById('submit-order');
submitOrderButton.addEventListener('click', () => {
  alert('Your order has been placed successfully!');
  document.getElementById('order-form').style.display = 'none';
});

// Cancel Order Form
const cancelOrderButton = document.getElementById('cancel-order');
cancelOrderButton.addEventListener('click', () => {
  document.getElementById('order-form').style.display = 'none';
});

// Add functionality to switch images
document.querySelectorAll('.product-card').forEach(productCard => {
  const mainImage = productCard.querySelector('.main-image'); // Main product image
  const additionalImages = productCard.querySelectorAll('.additional-images img'); // Additional images

  additionalImages.forEach(image => {
    image.addEventListener('click', () => {
      mainImage.src = image.src;

      // Update active class for the selected image
      additionalImages.forEach(img => img.classList.remove('active')); // Remove active class from all
      image.classList.add('active'); // active class to clicked image
    });
  });
});

// cart external page
cartIcon.addEventListener('click', () => {
  window.location.href = 'cart.html';
});

document.addEventListener('DOMContentLoaded', () => {
  const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));
  if (selectedProduct) {
    // Logic to show or highlight the selected product
    displaySelectedProduct(selectedProduct);
    // avoid repeated highlighting
    localStorage.removeItem('selectedProduct');
  }
});

function displaySelectedProduct(product) {
  // Scroll to the product or show a popup
  const productElement = document.querySelector(`[data-id="${product.id}"]`);
  if (productElement) {
    productElement.scrollIntoView({ behavior: 'smooth' });
    productElement.classList.add('highlight'); // CSS class to highlight the product
  }
}

// Function to update the cart count in the navbar
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount.textContent = cart.length;
}

// Update cart count whenever the page is loaded
document.addEventListener('DOMContentLoaded', updateCartCount);

