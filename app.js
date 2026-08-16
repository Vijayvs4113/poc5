const products = [
    {
        name: "Laptop",
        description: "High-performance laptop for work and development.",
        price: 65000
    },
    {
        name: "Smartphone",
        description: "Modern smartphone with a powerful processor and camera.",
        price: 30000
    },
    {
        name: "Headphones",
        description: "Wireless headphones with noise cancellation.",
        price: 5000
    },
    {
        name: "Keyboard",
        description: "Mechanical keyboard suitable for developers and gamers.",
        price: 3500
    }
];

function displayProducts() {
    const container = document.getElementById("product-container");

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="price">₹${product.price}</div>
        `;

        container.appendChild(card);
    });
}

async function loadConfig() {
    try {
        const response = await fetch("/config.json");

        if (response.ok) {
            const config = await response.json();

            if (config.appTitle) {
                document.getElementById("app-title").textContent =
                    config.appTitle;
            }
        }
    } catch (error) {
        console.log("Using default application configuration");
    }
}
loadConfig();
displayProducts();
