function loadOrders() {
        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        const container = document.getElementById("ordersContainer");

        if (orders.length === 0) {
          container.innerHTML = `
                    <div class="empty-orders">
                        <i class="fas fa-shopping-bag"></i>
                        <h3>No Orders Yet</h3>
                        <p>Orders will appear here when customers make purchases</p>
                    </div>
                `;
          updateStats(orders);
          return;
        }

        // Sort orders by date (newest first)
        orders.sort((a, b) => b.id - a.id);

        container.innerHTML = orders
          .map(
            (order) => `
                <div class="order-card">
                    <div class="order-header">
                        <div>
                            <div class="order-id">
                                <i class="fas fa-hashtag"></i> Order ${order.id}
                            </div>
                            <div class="order-date">
                                <i class="far fa-calendar-alt"></i> ${
                                  order.date
                                }
                            </div>
                        </div>
                        <button class="btn-delete-order" onclick="deleteOrder(${
                          order.id
                        })">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>

                    <div class="customer-info">
                        <h6><i class="fas fa-user"></i> Customer Information</h6>
                        <div class="customer-detail">
                            <i class="fas fa-user-circle"></i> <strong>Name:</strong> ${
                              order.customer.name
                            }
                        </div>
                        <div class="customer-detail">
                            <i class="fas fa-envelope"></i> <strong>Email:</strong> ${
                              order.customer.email
                            }
                        </div>
                        <div class="customer-detail">
                            <i class="fas fa-phone"></i> <strong>Phone:</strong> ${
                              order.customer.phone
                            }
                        </div>
                        <div class="customer-detail">
                            <i class="fas fa-map-marker-alt"></i> <strong>Address:</strong> ${
                              order.customer.address
                            }
                        </div>
                    </div>

                    <div class="order-items">
                        <h6 class="text-warning mb-3"><i class="fas fa-box"></i> Order Items</h6>
                        ${order.items
                          .map(
                            (item) => `
                            <div class="order-item">
                                <div>
                                    <div class="item-name">${item.name}</div>
                                    <div class="text-mutedd">Quantity: ${
                                      item.quantity
                                    } × $${item.price}</div>
                                </div>
                                <div class="item-price">$${(
                                  item.price * item.quantity
                                ).toFixed(2)}</div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>

                    <div class="order-total">
                        <span class="total-label">Total Amount:</span>
                        <span class="total-amount ms-3">$${order.total.toFixed(
                          2
                        )}</span>
                    </div>
                </div>
            `
          )
          .join("");

        updateStats(orders);
      }

      function updateStats(orders) {
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.total,
          0
        );
        const totalItems = orders.reduce(
          (sum, order) =>
            sum +
            order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
          0
        );

        const statsContainer = document.getElementById("statsContainer");
        statsContainer.innerHTML = `
                <div class="stat-card">
                    <div class="stat-value"><i class="fas fa-shopping-cart"></i> ${totalOrders}</div>
                    <div class="stat-label">Total Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value"><i class="fas fa-dollar-sign"></i> ${totalRevenue.toFixed(
                      2
                    )}</div>
                    <div class="stat-label">Total Revenue</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value"><i class="fas fa-box"></i> ${totalItems}</div>
                    <div class="stat-label">Items Sold</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value"><i class="fas fa-chart-line"></i> $${
                      totalOrders > 0
                        ? (totalRevenue / totalOrders).toFixed(2)
                        : "0.00"
                    }</div>
                    <div class="stat-label">Average Order</div>
                </div>
            `;
      }

      function deleteOrder(orderId) {
        if (confirm("Are you sure you want to delete this order?")) {
          let orders = JSON.parse(localStorage.getItem("orders")) || [];
          orders = orders.filter((order) => order.id !== orderId);
          localStorage.setItem("orders", JSON.stringify(orders));
          loadOrders();
          showNotification("Order deleted successfully!");
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

      // Load orders on page load
      loadOrders();