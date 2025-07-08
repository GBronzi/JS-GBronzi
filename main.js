// Array con bebidas
const bebidas = [
    { nombre: "Café", precio: 400 },
    { nombre: "Té", precio: 300 },
    { nombre: "Capuccino", precio: 550 }
];

// Mostrar menú
function mostrarMenu() {
    let mensaje = "Selecciona una bebida:\n";
    for (let i = 0; i < bebidas.length; i++) {
    mensaje += `${i + 1}. ${bebidas[i].nombre} - $${bebidas[i].precio}\n`;
    }
    console.log("Menú mostrado al usuario:");
    console.log(mensaje);
    
    return mensaje;
}

// Elegir bebida
function elegirBebida() {
    let opcion = parseInt(prompt(mostrarMenu()));
    console.log("Opción elegida:", opcion);
    
    if (opcion >= 1 && opcion <= bebidas.length) {
    const bebidaSeleccionada = bebidas[opcion - 1];
    console.log("Bebida seleccionada:", bebidaSeleccionada);
    
    return bebidaSeleccionada;
    } else {
    alert("Opción no válida. Intenta nuevamente.");
    console.warn("Opción fuera de rango. Reintentando...");
    
    return elegirBebida();
    }
}

// Calcular total
function calcularTotal(precio, cantidad) {
    const total = precio * cantidad;
    console.log(`Precio unitario: $${precio} - Cantidad: ${cantidad} - Total: $${total}`);
    return total;
}

// Simulador principal
function simuladorCafeteria() {
    do {
    const bebida = elegirBebida();
    const cantidad = parseInt(prompt(`¿Cuántos ${bebida.nombre}s deseas?`));
    console.log("Cantidad ingresada:", cantidad);

    const total = calcularTotal(bebida.precio, cantidad);

    alert(`Total a pagar por ${cantidad} ${bebida.nombre}(s): $${total}`);
    console.log(`Compra realizada: ${cantidad} x ${bebida.nombre} = $${total}`);
    } while (confirm("¿Deseas hacer otra compra?"));

    console.log("Salida de la cafeteria.");
}

// Ejecutar simulador
simuladorCafeteria();
