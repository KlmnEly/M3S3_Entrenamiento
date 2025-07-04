const apiUrl = 'http://localhost:8000/products';

const tbody = document.querySelector("#product-table tbody");

const editProductModalElement = document.getElementById("editProductModal");
const editProductModal = editProductModalElement
  ? new bootstrap.Modal(editProductModalElement)
  : null;

const editProductForm = document.getElementById("editProductForm");
const editProductId = document.getElementById("editProductId");
const editProductName = document.getElementById("editProductName");
const editProductPrice = document.getElementById("editProductPrice");



// Cargar Productos
async function loadProducts() {
  try {
    const response = await fetch(`${apiUrl}`); 
    const products = await response.json();
    tbody.innerHTML = ""; 

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center">No hay productos registrados.</td></tr>`;
      return;
    }

    products.forEach((product) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>
                    <button type='button' class='btn btn-warning btn-sm' onclick="editProduct(${product.id})">Editar</button>
                    <button type='button' class='btn btn-danger btn-sm' onclick="deleteProduct(${product.id})">Eliminar</button>
                </td>
            `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Error al cargar productos: ", err);
    tbody.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Error al cargar los datos: ${err.message}</td></tr>`;
  }
}

// Eliminar Productos
async function deleteProduct(id) {
  const confirmation = confirm(
    `¿Estás seguro de eliminar el producto con ID ${id}?`
  );
  if (!confirmation) return;

  try {
    await fetch(`${apiUrl}/${id}`, { method: "DELETE" });

    console.log(`Producto con ID ${id} eliminado exitosamente.`);
    await loadProducts();
    alert("Producto eliminado con éxito!");
  } catch (err) {
    console.error("Error al eliminar producto:", err);
    alert(
      `Error al eliminar el producto: ${
        err.message || "Por favor, verifica la consola para más detalles."
      }`
    );
  }
}

// Obtener datos del producto para editar
async function editProduct(productId) {
  if (!editProductModal || !editProductForm) {
    console.error(
      "Elementos del modal de edición de producto no encontrados. Verifica el HTML y la inicialización."
    );
    alert("Error: No se pudo iniciar el proceso de edición del producto.");
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${productId}`);
    const productToEdit = await response.json();

    editProductId.value = productToEdit.id;
    editProductName.value = productToEdit.name;
    editProductPrice.value = productToEdit.price;

    if (editProductForm.currentSubmitHandler) {
      editProductForm.removeEventListener(
        "submit",
        editProductForm.currentSubmitHandler
      );
    }
    editProductForm.currentSubmitHandler = async (event) => {
      await saveEditedProduct(event, productToEdit); 
    };
    editProductForm.addEventListener("submit", editProductForm.currentSubmitHandler);

    editProductModal.show();
  } catch (error) {
    console.error("Error al cargar datos del producto para edición:", error);
    alert(`No se pudo cargar la información del producto: ${error.message}`);
  }
}


// Guardar cambios del producto editado
async function saveEditedProduct(event, originalProduct) {
  event.preventDefault();

  if (!originalProduct) {
    console.error(
      "No se pudo obtener el producto original para la comparación en saveEditedProduct."
    );
    alert(
      "Ocurrió un error al intentar guardar los cambios. Por favor, recarga y reintenta."
    );
    return;
  }

  const id = editProductId.value;
  const newName = editProductName.value.trim();
  const newPrice = editProductPrice.value.trim();

  const updatedFields = {}; 

  if (newName !== originalProduct.name) {
    updatedFields.name = newName;
  }

  if (newPrice !== originalProduct.price) {
    updatedFields.price = newPrice;
  }

  if (Object.keys(updatedFields).length === 0) {
    alert("No se detectaron cambios para guardar.");
    editProductModal.hide();
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields), 
    });

    const result = await response.json();
    console.log("Producto actualizado exitosamente:", result);

    editProductModal.hide();
    alert("Producto actualizado con éxito!");
    await loadProducts();
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    alert(
      `Error al actualizar el producto: ${
        error.message || "Por favor, verifica la consola para más detalles."
      }`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {

  loadProducts();
});