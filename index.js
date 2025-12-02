let cart = JSON.parse(localStorage.getItem("cart")) || [];

      function loadProducts() {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const container = document.getElementById("productsContainer");

        if (products.length === 0) {
          container.innerHTML = `
                    <div class="col-12 text-center py-5">
                        <i class="fas fa-box-open fa-5x mb-3" style="color: #555;"></i>
                        <h3>No Products Available</h3>
                        <p class="text-mutedd">Please contact admin to add products</p>
                    </div>
                `;
          return;
        }

        container.innerHTML = products
          .map(
            (product) => `
                <div class="col-md-4">
                    <div class="product-card">
                        <img src="${product.image}" class="product-img" alt="${product.name}">
                        <div class="product-body">
                            <h5 class="product-title">${product.name}</h5>
                            <p class="text-mutedd">${product.description}</p>
                            <div class="product-price">$${product.price}</div>
                            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `
          )
          .join("");
      }
function loadProducts() {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // إضافة منتجات افتراضية لو مفيش منتجات
    if (products.length === 0) {
        products = [
            {
                id: 1,
                name: "Rolex Submariner",
                description: "Luxury diving watch with exceptional craftsmanship",
                price: 12500,
                image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500"
            },
            {
                id: 2,
                name: "Omega Seamaster",
                description: "Professional diver's watch with style",
                price: 8900,
                image: "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=500"
            },
            {
                id: 3,
                name: "TAG Heuer Carrera",
                description: "Swiss chronograph with racing heritage",
                price: 5200,
                image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500"
            },
            {
                id: 4,
                name: "Patek Philippe Nautilus",
                description: "Iconic luxury sports watch design",
                price: 35000,
                image: "https://images.unsplash.com/photo-1606390090711-27fca7d3c50e?w=500"
            },
            {
                id: 5,
                name: "Audemars Piguet Royal Oak",
                description: "Legendary octagonal bezel timepiece",
                price: 28500,
                image: "https://images.unsplash.com/photo-1622434641406-a158123450f9?w=500"
            },
            {
                id: 6,
                name: "Cartier Santos",
                description: "Classic square case with exposed screws",
                price: 7800,
                image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500"
            }
        ];
        
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    const container = document.getElementById('productsContainer');
    
    container.innerHTML = products.map(product => `
        <div class="col-md-4">
            <div class="product-card">
                <img src="${product.image}" class="product-img" alt="${product.name}">
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <p class="text-muted">${product.description}</p>
                    <div class="product-price">$${product.price}</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// استدعاء الدالة قبل تحميل المنتجات
initDefaultProducts();
loadProducts();
      function addToCart(productId) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products.find((p) => p.id === productId);

        if (product) {
          const existingItem = cart.find((item) => item.id === productId);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({ ...product, quantity: 1 });
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          updateCartCount();
          showNotification("Product added to cart!");
        }
      }

      function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById("cartCount").textContent = count;
      }

      function displayCart() {
        const container = document.getElementById("cartItems");

        if (cart.length === 0) {
          container.innerHTML =
            '<div class="empty-cart"><i class="fas fa-shopping-cart fa-5x mb-3"></i><h4>Your cart is empty</h4></div>';
          return;
        }

        const total = cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        container.innerHTML =
          cart
            .map(
              (item) => `
                <div class="cart-item">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-warning">${item.name}</h6>
                            <p class="mb-0 text-mutedd">$${item.price} x ${
                item.quantity
              }</p>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <strong class="text-success">$${(
                              item.price * item.quantity
                            ).toFixed(2)}</strong>
                            <button class="remove-btn" onclick="removeFromCart(${
                              item.id
                            })">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `
            )
            .join("") +
          `
                <div class="cart-item" style="background: rgba(255, 215, 0, 0.1);">
                    <div class="d-flex justify-content-between align-items-center">
                        <h5 class="mb-0 text-warning">Total:</h5>
                        <h4 class="mb-0 text-success">$${total.toFixed(2)}</h4>
                    </div>
                </div>
            `;
      }

      function removeFromCart(productId) {
        cart = cart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        displayCart();
      }

      function proceedToCheckout() {
        if (cart.length === 0) {
          alert("Your cart is empty!");
          return;
        }
        const cartModal = bootstrap.Modal.getInstance(
          document.getElementById("cartModal")
        );
        cartModal.hide();
        const checkoutModal = new bootstrap.Modal(
          document.getElementById("checkoutModal")
        );
        checkoutModal.show();
      }

      function confirmOrder() {
        const name = document.getElementById("customerName").value;
        const email = document.getElementById("customerEmail").value;
        const phone = document.getElementById("customerPhone").value;
        const address = document.getElementById("customerAddress").value;

        if (!name || !email || !phone || !address) {
          alert("Please fill in all fields!");
          return;
        }

        const order = {
          id: Date.now(),
          customer: { name, email, phone, address },
          items: cart,
          total: cart.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          date: new Date().toLocaleString(),
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();

        const checkoutModal = bootstrap.Modal.getInstance(
          document.getElementById("checkoutModal")
        );
        checkoutModal.hide();

        alert("Order placed successfully! Thank you for your purchase.");
        document.getElementById("checkoutForm").reset();
      }

      function showNotification(message) {
        const notification = document.createElement("div");
        notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
                color: #000;
                padding: 15px 25px;
                border-radius: 10px;
                font-weight: bold;
                z-index: 9999;
                box-shadow: 0 5px 20px rgba(74, 222, 128, 0.5);
            `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 2000);
      }

      document
        .getElementById("cartModal")
        .addEventListener("show.bs.modal", displayCart);

      loadProducts();
      updateCartCount();
