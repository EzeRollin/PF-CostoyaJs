document.addEventListener('DOMContentLoaded', () => {
    let botinesData = [];

    
    fetch('botines.json')
        .then(response => response.json())
        .then(data => {
            botinesData = data;
            displayBotinesList(botinesData);
            attachAddToCartEvent();
        })
        .catch(error => console.error('Error cargando el JSON:', error));

    
    function displayBotinesList(botinesList) {
        const listaContainerBotines = document.getElementById('botines-list');
        listaContainerBotines.innerHTML = '<h2>Lista de botines</h2>'; 
        botinesList.forEach(botines => {
            const botinesItem = document.createElement('div');
            botinesItem.classList.add('botines-item');
            botinesItem.innerHTML = `
                <span>${botines.modelo} $ ${botines.precio} </span>
                <button class="add-to-cart" data-id="${botines.id}">Añadir al Carrito</button>
            `;
            listaContainerBotines.appendChild(botinesItem);
        });
    }

    
    function attachAddToCartEvent() {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', event => {
                const botinesId = event.target.dataset.id;
                addToCart(botinesId);
            });
        });
    }

    
    const cart = [];

    
    function addToCart(id) {
        const botines = botinesData.find(item => item.id === id);
        if (botines) {
            cart.push(botines);
            updateCart();
            Swal.fire({
                icon: 'success',
                title: 'Añadido al Carrito',
                text: `${botines.modelo} fue añadido a tu carrito.`,
            });
        }
    }

    
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        cartItems.innerHTML = '';
        let totalprecio = 0;
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span>${item.modelo} $ ${item.precio} </span>
            `;
            cartItems.appendChild(cartItem);
            totalprecio += item.precio;
        });
        document.getElementById('total-precio').innerHTML = `<strong>Total: </strong>${totalprecio} `;
    }

   
    document.getElementById('checkout').addEventListener('click', () => {
        if (cart.length > 0) {
            Swal.fire({
                icon: 'success',
                title: 'Compra Realizada',
                text: 'Gracias por su compra!',
            });
            cart.length = 0;
            updateCart();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Carrito Vacío',
                text: 'Añada productos al carrito antes de finalizar su compra.',
            });
        }
    });

    
    document.getElementById('search').addEventListener('input', (event) => {
        const query = event.target.value.toLowerCase();
        const filteredData = botinesData.filter(botines => 
            botines.modelo.toLowerCase().includes(query)
        );
        displayBotinesList(filteredData);
        attachAddToCartEvent();
    });

    
    document.getElementById('sort').addEventListener('change', (event) => {
        const sortBy = event.target.value;
        let sortedData = [...botinesData];
        if (sortBy === 'modelo') {
            sortedData.sort((a, b) => a.modelo.localeCompare(b.modelo));
        } else if (sortBy === 'precio') {
            sortedData.sort((a, b) => a.precio - b.precio);
        }
        displayBotinesList(sortedData);
        attachAddToCartEvent();
    });
});