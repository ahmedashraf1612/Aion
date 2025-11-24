 let editingProductId = null;

      // Check if admin is logged in
      function checkAuth() {
        const isLoggedIn = localStorage.getItem("adminLoggedIn");
        if (isLoggedIn === "true") {
          showAdminPanel();
        }
      }

      // Login
      document
        .getElementById("loginForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const username = document.getElementById("username").value;
          const password = document.getElementById("password").value;

          if (username === "admin" && password === "admin123") {
            localStorage.setItem("adminLoggedIn", "true");
            showAdminPanel();
          } else {
            alert("Invalid credentials! Try: admin / admin123");
          }
        });

      function showAdminPanel() {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("logoutBtn").style.display = "block";
        loadProducts();
      }

      function logout() {
        localStorage.removeItem("adminLoggedIn");
        location.reload();
      }

      function loadProducts() {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const tbody = document.getElementById("productsTableBody");

        if (products.length === 0) {
          tbody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center py-5">
                            <i class="fas fa-box-open fa-3x mb-3" style="color: #555;"></i>
                            <p class="mb-0">No products yet. Add your first product!</p>
                        </td>
                    </tr>
                `;
          return;
        }

        tbody.innerHTML = products
          .map(
            (product) => `
                <tr>
                    <td>
                        <img src="${product.image}" class="product-img-preview" alt="${product.name}">
                    </td>
                    <td><strong class="text-warning">${product.name}</strong></td>
                    <td>${product.description}</td>
                    <td><strong class="text-success">$${product.price}</strong></td>
                    <td>
                        <button class="btn-edit" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete ms-2" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </td>
                </tr>
            `
          )
          .join("");
      }

      function openAddModal() {
        editingProductId = null;
        document.getElementById("modalTitle").innerHTML =
          '<i class="fas fa-plus-circle"></i> Add Product';
        document.getElementById("productForm").reset();
        document.getElementById("productId").value = "";
      }

      function editProduct(id) {
        const products = JSON.parse(localStorage.getItem("products")) || [];
        const product = products.find((p) => p.id === id);

        if (product) {
          editingProductId = id;
          document.getElementById("modalTitle").innerHTML =
            '<i class="fas fa-edit"></i> Edit Product';
          document.getElementById("productId").value = id;
          document.getElementById("productName").value = product.name;
          document.getElementById("productDescription").value =
            product.description;
          document.getElementById("productPrice").value = product.price;
          document.getElementById("productImage").value = product.image;

          const modal = new bootstrap.Modal(
            document.getElementById("productModal")
          );
          modal.show();
        }
      }

      function saveProduct() {
        const name = document.getElementById("productName").value;
        const description = document.getElementById("productDescription").value;
        const price = parseFloat(document.getElementById("productPrice").value);
        const image = document.getElementById("productImage").value;

        if (!name || !description || !price || !image) {
          alert("Please fill in all fields!");
          return;
        }

        let products = JSON.parse(localStorage.getItem("products")) || [];

        if (editingProductId) {
          // Edit existing product
          const index = products.findIndex((p) => p.id === editingProductId);
          if (index !== -1) {
            products[index] = {
              id: editingProductId,
              name,
              description,
              price,
              image,
            };
          }
        } else {
          // Add new product
          const newProduct = {
            id: Date.now(),
            name,
            description,
            price,
            image,
          };
          products.push(newProduct);
        }

        localStorage.setItem("products", JSON.stringify(products));

        const modal = bootstrap.Modal.getInstance(
          document.getElementById("productModal")
        );
        modal.hide();

        loadProducts();
        showNotification(
          editingProductId
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
      }

      function deleteProduct(id) {
        if (confirm("Are you sure you want to delete this product?")) {
          let products = JSON.parse(localStorage.getItem("products")) || [];
          products = products.filter((p) => p.id !== id);
          localStorage.setItem("products", JSON.stringify(products));
          loadProducts();
          showNotification("Product deleted successfully!");
        }
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

      checkAuth();