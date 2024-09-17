



const menu = document.getElementById('menu')
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsConatainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCount = document.getElementById('cart-count')
const addressInput = document.getElementById('address')
const addressWarn = document.getElementById('address-warn')




let cart = []

// abre o modal do carrinho
cartBtn.addEventListener('click', function () {
    cartModal.style.display = 'flex'
    updateCartModal();
})

// fecha o modal do carrinho 
cartModal.addEventListener('click', function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', function () {
    cartModal.style.display = 'none' // fecha o modal do carrinho 
})

menu.addEventListener('click', function (event) {
    let parentButton = event.target.closest('.add-to-cart-btn')

    if (parentButton) {
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        addToCart(name, price)
    }
})

// // adiciona o item ao carrinho 
function addToCart(name, price) {
    // verifica se o item já existe no carrinho
    const existingItem = cart.find(item => item.name === name)
    if (existingItem) {
        existingItem.quantity += 1
    } else {
        // adiciona o item ao carrinho
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal()
}

// // atualiza o carrinho no modal 
function updateCartModal() {
    cartItemsConatainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col');

        cartItemElement.innerHTML = `
          <div class='flex items-center justify-between'>
              <div>
                  <p class='font-medium'>${item.name}</p>               
                  <p> Qtd: ${item.quantity}</p>
                    <p class='font-medium mt-2'> R$: ${item.price.toFixed(2)}</p>
              </div>
            
                  <button class='remove-cart-btn' data-name="${item.name}">
                      Remover
                  </button>
             
          </div>

          `

        cartItemsConatainer.appendChild(cartItemElement);
        total += item.price * item.quantity;
    });

    // Atualiza o valor total do carrinho
    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    // Atualiza a contagem de itens no carrinho
    cartCount.textContent = cart.length;
}
// função para remover o item do carrinho 
cartItemsConatainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-cart-btn')) {
        const name = event.target.getAttribute('data-name')
        removeItemCart(name);
    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            updateCartModal();
            return;
        }
        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener('input', function (event) {
    let inputValue = event.target.value;
    if (inputValue === "") {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
    } else {
        addressWarn.classList.add('hidden')
        addressInput.classList.remove('border-red-500')
    }
    //     // verifica se o valor do input está vazio 
})





checkoutBtn.addEventListener('click', function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Cantina  fechada",
            duration: 3000,
            gravity: "top",
            position: "right",
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (addressInput.value === "") {
        addressWarn.classList.remove('hidden')
        addressInput.classList.add('border-red-500')
        return;

    }
    //Enviar o pedido para api whats  web 
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} - Qtd: ${item.quantity}) Preço :R$${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = ""
    window.open(`https://wa.me/${phone}?text=${message} Endereço : ${addressInput.value}`, "_blank")

    cart = [];
    updateCartModal();


})



function checkRestaurantOpen() {
    const now = new Date();
    const hora = now.getHours();
    const minutos = now.getMinutes();
    console.log(`Hora atual: ${hora}:${minutos}`);
    return hora >= 20 && hora < 23; // Assumindo que o restaurante está aberto das 19h às 21h
}

function updateRestaurantStatus() {
    const spanItem = document.getElementById('date-span');
    if (!spanItem) {
        console.error("Elemento com id 'date-span' não encontrado");
        return;
    }

    const isOpen = checkRestaurantOpen();
    console.log("Restaurante está aberto?", isOpen);

    if (isOpen) {
        spanItem.classList.remove('bg-red-500');
        spanItem.classList.add('bg-green-600');
        spanItem.textContent = "Aberto agora";
    } else {
        spanItem.classList.remove('bg-green-600');
        spanItem.classList.add('bg-red-500');
        spanItem.textContent = "Fechado";
    }

    console.log("Classes atuais do date-span:", spanItem.classList.toString());
}

// Executar a função quando a página carregar
document.addEventListener('DOMContentLoaded', updateRestaurantStatus);

// Atualizar o status a cada minuto
setInterval(updateRestaurantStatus, 60000);


