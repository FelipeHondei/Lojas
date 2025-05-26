let cart = [];
        let isCartOpen = false;

        function addToCart(id, name, price, icon) {
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: id,
                    name: name,
                    price: price,
                    icon: icon,
                    quantity: 1
                });
            }
            
            updateCartUI();
            showAddedToCartAnimation();
        }

        function removeFromCart(id) {
            cart = cart.filter(item => item.id !== id);
            updateCartUI();
        }

        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(id);
                } else {
                    updateCartUI();
                }
            }
        }

        function updateCartUI() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');
            
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartCount.textContent = totalItems;
            cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon">🛒</div>
                        <p>Seu carrinho está vazio</p>
                    </div>
                `;
                checkoutBtn.disabled = true;
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">${item.icon}</div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</div>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                                <span class="quantity">${item.quantity}</span>
                                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            </div>
                        </div>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                `).join('');
                checkoutBtn.disabled = false;
            }
        }

        function toggleCart() {
            const cartOverlay = document.getElementById('cartOverlay');
            isCartOpen = !isCartOpen;
            
            if (isCartOpen) {
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            } else {
                cartOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }

        function closeCartOverlay(event) {
            if (event.target === event.currentTarget) {
                toggleCart();
            }
        }

        function checkout() {
            if (cart.length === 0) return;
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            alert(`Compra finalizada!\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nObrigado pela sua compra!`);
            
            cart = [];
            updateCartUI();
            toggleCart();
        }

        function showAddedToCartAnimation() {
            const cartButton = document.querySelector('.cart-button');
            cartButton.style.transform = 'scale(1.2)';
            cartButton.style.background = 'linear-gradient(135deg, #00b894, #00a085)';
            
            setTimeout(() => {
                cartButton.style.transform = 'scale(1)';
                cartButton.style.background = 'linear-gradient(135deg, #ff6b6b, #ee5a24)';
            }, 200);
        }

        // Fechar carrinho com ESC
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && isCartOpen) {
                toggleCart();
            }
        });

        // Inicializar
        updateCartUI();