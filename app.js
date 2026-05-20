document.addEventListener("DOMContentLoaded", () => {
    
    // Verificación de seguridad
    if (typeof gsap === 'undefined') {
        console.error("GSAP no está cargado. Revisa las etiquetas <script> en tu HTML.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. ANIMACIÓN DEL HERO 
    // ==========================================
    const heroTimeline = gsap.timeline();

    heroTimeline.fromTo(".navbar", 
        { y: -50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo(".hero-text h1", 
        { y: 30, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
        "-=0.5"
    )
    .fromTo(".hero-text p, .hero-text .btn", 
        { y: 20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out" }, 
        "-=0.6"
    )
    .fromTo(".hero-image", 
        { x: 50, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" }, 
        "-=1"
    );

    // ==========================================
    // 2. POR QUÉ ELEGIRNOS (.features)
    // ==========================================
    gsap.fromTo(".feature-card", 
        { y: 50, opacity: 0 },
        {
            scrollTrigger: { trigger: ".features", start: "top 90%" },
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out"
        }
    );

    // ==========================================
    // 3. MENÚ COMPLETO
    // ==========================================
    const menuCategories = gsap.utils.toArray('.menu-category');
    
    menuCategories.forEach((category) => {
        gsap.fromTo(category, 
            { y: 40, opacity: 0 },
            {
                scrollTrigger: { trigger: category, start: "top 85%" },
                y: 0, opacity: 1, duration: 0.8, ease: "power2.out"
            }
        );
    });

    // ==========================================
    // 4. MAPA Y CHECKOUT
    // ==========================================
    gsap.fromTo(".checkout-map-section > div", 
        { y: 50, opacity: 0 },
        {
            scrollTrigger: { trigger: ".checkout-map-section", start: "top 80%" },
            y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: "power3.out"
        }
    );

    // ==========================================
    // 5. LÓGICA DEL CARRITO DE COMPRAS AVANZADA
    // ==========================================
    
    let cart = [];
    const cartItemsContainer = document.getElementById('lista-productos');
    const cartTotalContainer = document.getElementById('contenedor-total');
    const addButtons = document.querySelectorAll('.product-info .btn-primary');
    const pedidoForm = document.getElementById('pedido-form');

    // Función para actualizar la vista
    function updateCartUI() {
        if (!cartItemsContainer || !cartTotalContainer) return; 
        
        cartItemsContainer.innerHTML = '';
        cartTotalContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Tu carrito está vacío. ¡Agrega deliciosos asados!</p>';
            return;
        }

        cart.forEach((item) => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const itemHTML = `
                <div class="cart-item-row" data-name="${item.name}">
                    <div class="cart-item-info">
                        <span>${item.name}</span>
                        <span style="color: var(--gold); font-weight: bold;">$${subtotal}</span>
                    </div>
                    <div class="qty-controls">
                        <div class="qty-box">
                            <button type="button" class="btn-qty btn-minus">-</button>
                            <span style="color: white; width: 15px; text-align: center; font-size: 0.9rem;">${item.quantity}</span>
                            <button type="button" class="btn-qty btn-plus">+</button>
                        </div>
                        <button type="button" class="btn-delete">Eliminar</button>
                    </div>
                </div>
            `;
            cartItemsContainer.innerHTML += itemHTML;
        });

        // HTML del Total (Afuera del scroll)
        const totalHTML = `
            <div class="cart-total" style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 15px; border-top: 1px dashed rgba(255,255,255,0.2);">
                <strong>Total a pagar:</strong>
                <strong style="color: var(--gold); font-size: 1.4rem;">$${total} MXN</strong>
            </div>
        `;
        cartTotalContainer.innerHTML = totalHTML;
    }

    updateCartUI(); // Carga el estado inicial

    // Eventos para Botones de Agregar al Carrito
    if (addButtons) {
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = e.target.closest('.product-info');
                if (!productCard) return;

                const productName = productCard.querySelector('h4').innerText;
                const priceNumber = parseFloat(productCard.querySelector('.price').innerText.replace('$', '').replace(' MXN', '').trim());

                const existingItem = cart.find(item => item.name === productName);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({ name: productName, price: priceNumber, quantity: 1 });
                }

                updateCartUI();

                // Feedback visual
                const originalText = button.innerText;
                const originalColor = button.style.backgroundColor;
                button.innerText = "¡Agregado! ✔️";
                button.style.backgroundColor = "var(--whatsapp-green)";
                setTimeout(() => {
                    button.innerText = originalText;
                    button.style.backgroundColor = originalColor;
                }, 1000);
            });
        });
    }

    // Delegación de eventos para sumar, restar o eliminar dentro del panel
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const itemRow = e.target.closest('.cart-item-row');
            if (!itemRow) return;
            
            const productName = itemRow.dataset.name;
            const item = cart.find(i => i.name === productName);

            if (e.target.classList.contains('btn-plus')) {
                item.quantity++;
                updateCartUI();
            } else if (e.target.classList.contains('btn-minus')) {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(i => i.name !== productName);
                }
                updateCartUI();
            } else if (e.target.classList.contains('btn-delete')) {
                cart = cart.filter(i => i.name !== productName);
                updateCartUI();
            }
        });
    }

    // Envío del Formulario a WhatsApp
    if (pedidoForm) {
        pedidoForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (cart.length === 0) {
                alert("Tu carrito está vacío. Agrega productos al carrito antes de hacer tu pedido.");
                return;
            }

            const tipoEntrega = document.getElementById('tipo-entrega').value;
            const metodoPago = document.getElementById('metodo-pago').value;
            const nombre = document.getElementById('cliente-nombre').value;
            const telefono = document.getElementById('cliente-tel').value;
            const direccion = document.getElementById('cliente-dir').value;

            let total = 0;
            let mensaje = `*¡Hola Asados Noguez!* 🔥\nQuiero confirmar mi pedido:\n\n`;

            cart.forEach(item => {
                const subtotal = item.price * item.quantity;
                total += subtotal;
                mensaje += `▪️ ${item.quantity}x ${item.name} ($${subtotal})\n`;
            });

            mensaje += `\n*Total a pagar:* $${total} MXN\n`;
            mensaje += `--------------------------\n`;
            mensaje += `*Datos del Cliente:*\n`;
            mensaje += `👤 Nombre: ${nombre}\n`;
            mensaje += `📞 Teléfono: ${telefono}\n`;
            mensaje += `🛵 Tipo de Entrega: ${tipoEntrega}\n`;
            
            if (tipoEntrega === 'Entrega a Domicilio' && direccion !== '') {
                mensaje += `📍 Dirección: ${direccion}\n`;
            }
            
            mensaje += `💵 Método de Pago: ${metodoPago}\n`;

            const numeroWhatsApp = "525547266259";
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
            window.open(url, '_blank');
        });
    }

    // ==========================================
    // 6. CURSOR PERSONALIZADO (Avanzado y sin bugs)
    // ==========================================
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
        // Movimiento suave y reaparición automática
        document.addEventListener('mousemove', (e) => {
            cursor.style.opacity = '1'; // Si estaba oculto, lo fuerza a aparecer
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.15, 
                ease: "power2.out"
            });
        });

        // SOLUCIÓN BUG "Línea del Head": Ocultar al sacar el ratón de la pantalla
        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget) { // Si ya no hay elemento destino, salimos de la ventana
                cursor.style.opacity = '0';
            }
        });

        // Efecto expansivo (Hover)
        const interactables = document.querySelectorAll('a, button, .product-card, .custom-select, .custom-options li');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover-effect'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover-effect'));
        });

        // SOLUCIÓN BUG INPUTS: Ocultarlo para poder escribir cómodamente
        const textInputs = document.querySelectorAll('input');
        textInputs.forEach(input => {
            input.addEventListener('mouseenter', () => cursor.style.opacity = '0');
            input.addEventListener('mouseleave', () => cursor.style.opacity = '1');
        });

        // SOLUCIÓN BUG MAPA: Ocultar el cursor falso antes de tocar el Iframe
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.addEventListener('mouseenter', () => cursor.style.opacity = '0');
            mapContainer.addEventListener('mouseleave', () => cursor.style.opacity = '1');
        }
    }
    
    // ==========================================
    // 7. LÓGICA DE LOS SELECTS PERSONALIZADOS
    // ==========================================
    function setupCustomSelect(selectId, optionsId, inputId) {
        const select = document.getElementById(selectId);
        const optionsContainer = document.getElementById(optionsId);
        const input = document.getElementById(inputId);
        const options = optionsContainer.querySelectorAll('li');
        const selectedValue = select.querySelector('.selected-value');

        if(!select) return; // Seguridad

        // Abrir/Cerrar al hacer clic
        select.addEventListener('click', () => {
            select.classList.toggle('open');
            optionsContainer.classList.toggle('open');
        });

        // Cambiar opción
        options.forEach(option => {
            option.addEventListener('click', () => {
                selectedValue.textContent = option.textContent; // Cambia el texto visible
                input.value = option.dataset.value; // Cambia el valor real para WhatsApp
                
                // Cierra el menú
                select.classList.remove('open');
                optionsContainer.classList.remove('open');
            });
        });

        // Cerrar si el usuario hace clic afuera del select
        document.addEventListener('click', (e) => {
            if (!select.contains(e.target) && !optionsContainer.contains(e.target)) {
                select.classList.remove('open');
                optionsContainer.classList.remove('open');
            }
        });
    }

    // ==========================================
    // 8. HEADER DINÁMICO AL HACER SCROLL
    // ==========================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            // Si el usuario baja más de 50 pixeles, aparece el cristal
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled'); // Vuelve a ser transparente
            }
        });
    }

    // Código previo de los Selects Personalizados (Sección 7) se queda igual...
    function setupCustomSelect(selectId, optionsId, inputId) {
        const select = document.getElementById(selectId);
        const optionsContainer = document.getElementById(optionsId);
        const input = document.getElementById(inputId);
        const options = optionsContainer?.querySelectorAll('li');
        const selectedValue = select?.querySelector('.selected-value');

        if(!select) return;

        select.addEventListener('click', () => {
            select.classList.toggle('open');
            optionsContainer.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', () => {
                selectedValue.textContent = option.textContent;
                input.value = option.dataset.value;
                select.classList.remove('open');
                optionsContainer.classList.remove('open');
            });
        });

        document.addEventListener('click', (e) => {
            if (!select.contains(e.target) && !optionsContainer.contains(e.target)) {
                select.classList.remove('open');
                optionsContainer.classList.remove('open');
            }
        });
    }

    // ==========================================
    // 9. MENÚ HAMBURGUESA MÓVIL (Con cierre inteligente)
    // ==========================================
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinksContainer = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav-link');

    if (mobileMenu && navLinksContainer) {
        // Abrir y cerrar al tocar las 3 rayitas
        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que este clic confunda a la función de abajo
            mobileMenu.classList.toggle('is-active');
            navLinksContainer.classList.toggle('active');
        });

        // Cerrar automáticamente cuando eligen una opción del menú
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileMenu.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
            });
        });

        // NUEVO: Cerrar al tocar fuera del menú (el 30% restante de la página)
        document.addEventListener('click', (e) => {
            // Verifica si el menú está abierto Y si el clic NO fue dentro de la caja del menú
            if (navLinksContainer.classList.contains('active') && !navLinksContainer.contains(e.target)) {
                mobileMenu.classList.remove('is-active');
                navLinksContainer.classList.remove('active');
            }
        });
    }

    // Inicializamos nuestros dos selects
    setupCustomSelect('select-entrega', 'options-entrega', 'tipo-entrega');
    setupCustomSelect('select-pago', 'options-pago', 'metodo-pago');

});