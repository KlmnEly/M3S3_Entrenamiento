
const apiUrl = "http://localhost:8000/products"; 

const productForm = document.getElementById("productForm"); 
const displayUsernameElement = document.getElementById("displayUsername");

async function createProduct(event) {
  event.preventDefault(); 

  try {
    const responseProducts = await fetch(apiUrl);
    const products = await responseProducts.json();

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();

    if (!name) {
      alert("Por favor, introduce el nombre del producto.");
      return;
    }

    if (!price) {
      alert("Por favor, introduce el precio del producto.");
      return;
    }

    const lastProductId =
      products.length > 0 ? Math.max(...products.map((product) => product.id)) : 0;
    const newProductId = lastProductId + 1;

    const newProduct = {
      id: String(newProductId),
      name: name,
      price: price
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    const createdProduct = await response.json();
    console.log("Producto creado exitosamente:", createdProduct);

    productForm.reset();
    alert("Producto creado con éxito!");

  } catch (error) {
    console.error("Error al registrar el producto:", error);
    alert(
      `Error al crear el producto: ${
        error.message || "Por favor, verifica la consola para más detalles."
      }`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {

  if (productForm) {
    productForm.addEventListener("submit", createProduct);
  } else {
    console.error(
      'Error: No se encontró el formulario con ID "productForm". Verifica tu HTML.'
    );
  }
});