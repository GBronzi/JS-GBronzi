// Las bebidas que vendemos
const bebidas = [
    { id: 1, nombre: "Café", precio: 400, emoji: "☕" },
    { id: 2, nombre: "Té", precio: 300, emoji: "🍵" },
    { id: 3, nombre: "Capuccino", precio: 550, emoji: "☕" }
];

// Aquí guardamos lo que compra el usuario
let carrito = [];

// Variables para los botones y elementos de la página
let menuContainer;
let cartContainer;
let cartItems;
let totalAmount;
let clearCartBtn;
let checkoutBtn;
let modal;
let closeModal;
let newOrderBtn;
let purchaseSummary;

// Función que inicia todo
function inicializarApp() {
    obtenerElementosDOM();
    cargarCarritoDesdeStorage();
    mostrarMenu();
    actualizarCarrito();
    configurarEventos();
}

// Empezar la aplicación
inicializarApp();

// Buscar los elementos en la página
function obtenerElementosDOM() {
    menuContainer = document.getElementById('menu-container');
    cartContainer = document.getElementById('cart-container');
    cartItems = document.getElementById('cart-items');
    totalAmount = document.getElementById('total-amount');
    clearCartBtn = document.getElementById('clear-cart');
    checkoutBtn = document.getElementById('checkout');
    modal = document.getElementById('checkout-modal');
    closeModal = document.querySelector('.close');
    newOrderBtn = document.getElementById('new-order');
    purchaseSummary = document.getElementById('purchase-summary');
}

// Mostrar las bebidas en la página
function mostrarMenu() {
    menuContainer.innerHTML = '';

    // Recorrer todas las bebidas
    for (let i = 0; i < bebidas.length; i++) {
        const menuItem = crearElementoMenu(bebidas[i]);
        menuContainer.appendChild(menuItem);
    }
}

// Crear cada bebida del menú
function crearElementoMenu(bebida) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';

    const titulo = document.createElement('h3');
    titulo.textContent = bebida.emoji + ' ' + bebida.nombre;

    const precio = document.createElement('div');
    precio.className = 'price';
    precio.textContent = '$' + bebida.precio;

    const controles = document.createElement('div');
    controles.className = 'quantity-controls';

    const btnMenos = document.createElement('button');
    btnMenos.className = 'quantity-btn';
    btnMenos.textContent = '-';
    btnMenos.id = 'btn-' + bebida.id + '-restar';

    const cantidad = document.createElement('span');
    cantidad.className = 'quantity-display';
    cantidad.id = 'qty-' + bebida.id;
    cantidad.textContent = '1';

    const btnMas = document.createElement('button');
    btnMas.className = 'quantity-btn';
    btnMas.textContent = '+';
    btnMas.id = 'btn-' + bebida.id + '-sumar';

    const btnAgregar = document.createElement('button');
    btnAgregar.className = 'btn btn-primary add-to-cart';
    btnAgregar.textContent = 'Agregar al Carrito';
    btnAgregar.id = 'add-' + bebida.id;

    controles.appendChild(btnMenos);
    controles.appendChild(cantidad);
    controles.appendChild(btnMas);

    menuItem.appendChild(titulo);
    menuItem.appendChild(precio);
    menuItem.appendChild(controles);
    menuItem.appendChild(btnAgregar);

    return menuItem;
}

// Cambiar cuántas bebidas quiere el usuario
function cambiarCantidad(bebidaId, cambio) {
    const qtyElement = document.getElementById('qty-' + bebidaId);
    let cantidad = parseInt(qtyElement.textContent) + cambio;

    // No puede ser menos de 1 ni más de 10
    if (cantidad < 1) cantidad = 1;
    if (cantidad > 10) cantidad = 10;

    qtyElement.textContent = cantidad;
}

// Agregar bebida al carrito
function agregarAlCarrito(bebidaId) {
    // Buscar qué bebida es
    let bebida = null;
    for (let i = 0; i < bebidas.length; i++) {
        if (bebidas[i].id === bebidaId) {
            bebida = bebidas[i];
            break;
        }
    }

    const cantidad = parseInt(document.getElementById('qty-' + bebidaId).textContent);

    // Ver si ya tenemos esta bebida en el carrito
    let itemExistente = null;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === bebidaId) {
            itemExistente = carrito[i];
            break;
        }
    }

    if (itemExistente) {
        // Si ya la tenemos, sumar más
        itemExistente.cantidad += cantidad;
    } else {
        // Si no la tenemos, agregarla nueva
        carrito.push({
            id: bebida.id,
            nombre: bebida.nombre,
            precio: bebida.precio,
            cantidad: cantidad,
            emoji: bebida.emoji
        });
    }

    // Volver la cantidad a 1
    document.getElementById('qty-' + bebidaId).textContent = '1';

    // Actualizar el carrito en la página
    actualizarCarrito();

    // Guardar en localStorage
    guardarCarritoEnStorage();
}

// Mostrar el carrito en la página
function actualizarCarrito() {
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        totalAmount.textContent = '0';
        checkoutBtn.disabled = true;
        clearCartBtn.disabled = true;
        return;
    }

    // Limpiar el carrito
    cartItems.innerHTML = '';
    let total = 0;

    // Mostrar cada cosa del carrito
    for (let i = 0; i < carrito.length; i++) {
        let item = carrito[i];
        const subtotal = item.precio * item.cantidad;
        total = total + subtotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        const itemInfo = document.createElement('div');
        itemInfo.className = 'cart-item-info';

        const itemName = document.createElement('div');
        itemName.className = 'cart-item-name';
        itemName.textContent = item.emoji + ' ' + item.nombre;

        const itemDetails = document.createElement('div');
        itemDetails.className = 'cart-item-details';
        itemDetails.textContent = item.cantidad + ' x $' + item.precio + ' = $' + subtotal;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'cart-item-remove';
        removeBtn.textContent = 'Eliminar';
        removeBtn.id = 'remove-' + item.id;

        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemDetails);
        cartItem.appendChild(itemInfo);
        cartItem.appendChild(removeBtn);
        cartItems.appendChild(cartItem);
    }

    totalAmount.textContent = total;
    checkoutBtn.disabled = false;
    clearCartBtn.disabled = false;
}

// Quitar una bebida del carrito
function removerDelCarrito(bebidaId) {
    // Hacer un nuevo carrito sin esa bebida
    let nuevoCarrito = [];
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id !== bebidaId) {
            nuevoCarrito.push(carrito[i]);
        }
    }
    carrito = nuevoCarrito;
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Vaciar todo el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Comprar todo
function finalizarCompra() {
    if (carrito.length === 0) {
        return;
    }

    // Sumar todo lo que cuesta
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total = total + (carrito[i].precio * carrito[i].cantidad);
    }

    // Hacer el resumen de la compra
    let resumen = '<h3>Resumen de tu compra:</h3><ul>';
    for (let i = 0; i < carrito.length; i++) {
        let item = carrito[i];
        resumen += '<li>' + item.emoji + ' ' + item.cantidad + ' x ' + item.nombre + ' = $' + (item.precio * item.cantidad) + '</li>';
    }
    resumen += '</ul><h3>Total: $' + total + '</h3>';

    purchaseSummary.innerHTML = resumen;

    // Mostrar la ventana con el resumen
    modal.style.display = 'block';

    // Vaciar el carrito después de comprar
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnStorage();
}

// Configurar todos los botones
function configurarEventos() {
    // Botones del carrito
    clearCartBtn.addEventListener('click', vaciarCarrito);
    checkoutBtn.addEventListener('click', finalizarCompra);

    // Botones del modal
    closeModal.addEventListener('click', cerrarModal);
    newOrderBtn.addEventListener('click', cerrarModal);

    // Cerrar modal si haces click afuera
    document.addEventListener('click', function(event) {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Botones del menú
    menuContainer.addEventListener('click', function(event) {
        // Si es un botón de cantidad
        if (event.target.className === 'quantity-btn') {
            const partes = event.target.id.split('-');
            const bebidaId = parseInt(partes[1]);
            const accion = partes[2];

            if (accion === 'sumar') {
                cambiarCantidad(bebidaId, 1);
            } else if (accion === 'restar') {
                cambiarCantidad(bebidaId, -1);
            }
        }

        // Si es un botón de agregar al carrito
        if (event.target.className.includes('add-to-cart')) {
            const bebidaId = parseInt(event.target.id.split('-')[1]);
            agregarAlCarrito(bebidaId);
        }
    });

    // Botones del carrito
    cartItems.addEventListener('click', function(event) {
        if (event.target.className === 'cart-item-remove') {
            const bebidaId = parseInt(event.target.id.split('-')[1]);
            removerDelCarrito(bebidaId);
        }
    });
}



// Cerrar la ventana
function cerrarModal() {
    modal.style.display = 'none';
}

// Guardar el carrito localstorage
function guardarCarritoEnStorage() {
    localStorage.setItem('carritoGBronzi', JSON.stringify(carrito));
}

// Cargar el carrito guardado
function cargarCarritoDesdeStorage() {
    const carritoGuardado = localStorage.getItem('carritoGBronzi');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// Calcular cuánto cuesta
function calcularTotal(precio, cantidad) {
    return precio * cantidad;
}
