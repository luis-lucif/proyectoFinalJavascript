const Clickbutton = document.querySelectorAll(".button");
const tbody = document.querySelector(".tbody");

const vaciarbtn = document.getElementById("btn__vaciar");
btn__vaciar.addEventListener("click", vaciarButtonClicked);

const compraBtn = document.getElementById("btn__comprar");
btn__comprar.addEventListener("click", comprarButtonClicked);

const openModal = document.getElementById("btn__comprar");
const modal = document.querySelector(".modal");
const closeModal = document.querySelector(".modal__close");

const pagarBtn = document.querySelector(".buttonPagar");
pagarBtn.addEventListener("click", pagarButtonClicked);

let carrito = [];

Clickbutton.forEach((btn) => {
  btn.addEventListener("click", addToCarritoItem);
});

function addToCarritoItem(e) {
  const button = e.target;
  const item = button.closest(".card");
  const itemTitle = item.querySelector(".card-title").textContent;
  const itemPrice = item.querySelector(".precio").textContent;
  const itemImg = item.querySelector(".card-img-top").src;

  const newItem = {
    title: itemTitle,
    precio: itemPrice,
    img: itemImg,
    cantidad: 1,
  };

  addItemCarrito(newItem);
}

function addItemCarrito(newItem) {
  Toastify({
    text: "Producto agregado al carrito",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)",
      color: "black",
      fontWeight: "bold",
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  const InputElemnto = tbody.getElementsByClassName("input__elemento");
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === newItem.title.trim()) {
      carrito[i].cantidad++;
      const inputValue = InputElemnto[i];
      inputValue.value++;
      CarritoTotal();
      return null;
    }
  }

  carrito.push(newItem);

  renderCarrito();
}

function renderCarrito() {
  tbody.innerHTML = "";
  carrito.map((item) => {
    const tr = document.createElement("tr");
    tr.classList.add("ItemCarrito");
    let { img, title, precio, cantidad } = item;
    const Content = `
    <th scope="row">1</th>
            <td class="table__productos">
              <img src=${img}  alt="">
              <h6 class="title">${title}</h6>
            </td>
            <td class="table__price"><p>${precio}</p></td>
            <td class="table__cantidad">
              <input type="number" min="1" value=${cantidad} class="input__elemento">
              <button class="delete btn btn-danger">x</button>
            </td>
    
    `;
    tr.innerHTML = Content;
    tbody.append(tr);

    tr.querySelector(".delete").addEventListener("click", removeItemCarrito);
    tr.querySelector(".input__elemento").addEventListener(
      "change",
      sumaCantidad
    );
  });
  CarritoTotal();
}

function CarritoTotal() {
  let Total = 0;
  const itemCartTotal = document.querySelector(".itemCartTotal");
  carrito.forEach((item) => {
    const precio = Number(item.precio.replace("$", ""));
    Total = Total + precio * item.cantidad;
  });

  itemCartTotal.innerHTML = `Total $${Total}`;
  addLocalStorage();
}

function removeItemCarrito(e) {
  const buttonDelete = e.target;
  const tr = buttonDelete.closest(".ItemCarrito");
  const title = tr.querySelector(".title").textContent;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].title.trim() === title.trim()) {
      carrito.splice(i, 1);
    }
  }

  Toastify({
    text: "Producto Eliminado",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "linear-gradient(160deg, #ff2600 0%, #ff7b00 100%)",
      color: "black",
      fontWeight: "bold",
    },
    onClick: function () {}, // Callback after click
  }).showToast();

  tr.remove();
  CarritoTotal();
}

function sumaCantidad(e) {
  const sumaInput = e.target;
  const tr = sumaInput.closest(".ItemCarrito");
  const title = tr.querySelector(".title").textContent;
  carrito.forEach((item) => {
    if (item.title.trim() === title) {
      sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
      item.cantidad = sumaInput.value;
      CarritoTotal();
    }
  });
}

function addLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

window.onload = function () {
  const storage = JSON.parse(localStorage.getItem("carrito"));
  if (storage) {
    carrito = storage;
    renderCarrito();
  }
};

//opiniones

const opiniones = [];

contenedor = document.querySelector(".contenedor");

const pedirOpiniones = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(opiniones);
    });
  });
};

const renderOpiniones = (arr) => {
  // función que genere la vista de los productos
  let html;
  for (const item of arr) {
    const { nombre, img, opinion } = item;

    html = `
        <div class="card__op">
      <div class="card-image">
        <img class=img src="../img/${img}">
        <span class="card-title">${nombre.toUpperCase()}</span>
      </div>
      <div class="card-content">
        
      <p class="p">${opinion}</p>
      
      </div>
      <div class="card-action">
        
      </div>
      </div>
     `;

    contenedor.innerHTML += html;
  }
};

pedirOpiniones().then((respuesta) => {
  contenedor.textContent = "";

  renderOpiniones(opiniones);
});

const respuesta = async () => {
  const response = await fetch("./js/data.json");

  const data = await response.json();
  renderOpiniones(data);
};

respuesta();

//comprar//

function vaciarButtonClicked() {
  localStorage.removeItem("carrito");
  for (let index = 0; index < carrito.length; index++) {
    carrito.splice(index, carrito.length);
  }
  console.log(carrito);
  renderCarrito();

  Swal.fire({
    icon: "success",
    title: "Carrito Vacio",
  });
}

function comprarButtonClicked() {
  openModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("modal--show");

    localStorage.removeItem("carrito");
    for (let index = 0; index < carrito.length; index++) {
      carrito.splice(index, carrito.length);
    }
    console.log(carrito);
    renderCarrito();
  });

  closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.remove("modal--show");
  });
}

let stripe = Stripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");
let elements = stripe.elements();

let card = elements.create("card", {
  hidePostalCode: true,
  style: {
    base: {
      iconColor: "#666EE8",
      color: "#31325F",
      lineHeight: "40px",
      fontWeight: 300,
      fontFamily: "Helvetica Neue",
      fontSize: "15px",

      "::placeholder": {
        color: "#CFD7E0",
      },
    },
  },
});
card.mount("#card-element");

function setOutcome(result) {
  let successElement = document.querySelector(".success");
  let errorElement = document.querySelector(".error");
  successElement.classList.remove("visible");
  errorElement.classList.remove("visible");

  if (result.token) {
    Swal.fire({
      position: "top",
      icon: "success",
      title: "Su pedido llegara pronto!!",
      showConfirmButton: false,
      timer: 1500,
    });
  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add("visible");
  }
}

card.on("change", function (event) {
  setOutcome(event);
});

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  let options = {
    name:
      document.getElementById("first-name").value +
      " " +
      document.getElementById("last-name").value,
    address_line1: document.getElementById("address-line1").value,
    address_city: document.getElementById("address-city").value,
    address_state: document.getElementById("address-state").value,
    address_zip: document.getElementById("address-zip").value,
    address_country: document.getElementById("address-country").value,
  };
  stripe.createToken(card, options).then(setOutcome);
});

function pagarButtonClicked() {}

//formulario//

const formulario = document.getElementById("formulario");
const inputs = document.querySelectorAll("#formulario input");
const formulario__btn = document.querySelector(".formulario__btn");

const expresiones = {
  usuario: /^[a-zA-Z0-9\_\-]{4,16}$/,
  nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
  password: /^.{4,12}$/,
  correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
  telefono: /^\d{7,14}$/,
};

const usuarios = {
  usuario: "luis123",
  nombre: "luis",
  password: "abc123",
  correo: "correo@gmail.com",
  telefono: "1152367587",
};

const desectructurar = ({ usuario, nombre, password, correo, telefono }) => {
  console.log(usuario, nombre, password, correo, telefono);
};

desectructurar(usuarios);

const campos = {
  usuario: false,
  nombre: false,
  password: false,
  correo: false,
  telefono: false,
};

function registro(usuario, nombre, password, correo, telefono) {
  this.usuario = usuario;
  this.nombre = nombre;
  this.password = password;
  this.correo = correo;
  this.telefono = parseInt(telefono);
}

const validarformulario = (e) => {
  switch (e.target.name) {
    case "usuario":
      validarCampo(expresiones.usuario, e.target, "usuario");
      break;

    case "nombre":
      validarCampo(expresiones.nombre, e.target, "nombre");
      break;

    case "password":
      validarCampo(expresiones.password, e.target, "password");
      validarpassword2();
      break;

    case "password2":
      validarpassword2();
      break;

    case "correo":
      validarCampo(expresiones.correo, e.target, "correo");
      break;

    case "telefono":
      validarCampo(expresiones.telefono, e.target, "telefono");
      break;
  }
};

const validarCampo = (expresion, input, campo) => {
  if (expresion.test(input.value)) {
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    campos[campo] = true;
  } else {
    document
      .getElementById(`grupo__${campo}`)
      .classList.add("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__${campo}`)
      .classList.remove("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.add("fa-times-circle");
    document
      .querySelector(`#grupo__${campo} i`)
      .classList.remove("fa-check-circle");
    document
      .querySelector(`#grupo__${campo} .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    campos[campo] = false;
  }
};

const validarpassword2 = () => {
  const inputPassword1 = document.getElementById("password");
  const inputPassword2 = document.getElementById("password2");

  if (inputPassword1.value !== inputPassword2.value) {
    document
      .getElementById(`grupo__password2`)
      .classList.add("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__password2`)
      .classList.remove("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__password2 i`)
      .classList.add("fa-times-circle");
    document
      .querySelector(`#grupo__password2 i`)
      .classList.remove("fa-check-circle");
    document
      .querySelector(`#grupo__password2 .formulario__input-error`)
      .classList.add("formulario__input-error-activo");
    campos["password"] = false;
  } else {
    document
      .getElementById(`grupo__password2`)
      .classList.remove("formulario__grupo-incorrecto");
    document
      .getElementById(`grupo__password2`)
      .classList.add("formulario__grupo-correcto");
    document
      .querySelector(`#grupo__password2 i`)
      .classList.remove("fa-times-circle");
    document
      .querySelector(`#grupo__password2 i`)
      .classList.add("fa-check-circle");
    document
      .querySelector(`#grupo__password2 .formulario__input-error`)
      .classList.remove("formulario__input-error-activo");
    campos["password"] = true;
  }
};

inputs.forEach((input) => {
  input.addEventListener("keyup", validarformulario);
  input.addEventListener("blur", validarformulario);
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const terminos = document.getElementById("terminos");

  campos.usuario && campos.nombre && campos,
    password && campos.correo && campos.telefono && terminos.checked
      ? formulario.reset()
      : document
          .getElementById("formulario__mensaje")
          .classList.add("formulario__mensaje-activo");

  document
    .getElementById("formulario__mensaje-exito")
    .classList.add("formulario__mensaje-exito-activo");
  setTimeout(() => {
    document
      .getElementById("formulario__mensaje-exito")
      .classList.remove("formulario__mensaje-exito-activo");
  }, 5000);

  document.querySelectorAll(".formulario__grupo-correcto").forEach((icono) => {
    icono.classList.remove("formulario__grupo-correcto");
  });
});

function cargarUsuario(arr, obj) {
  return arr.push(obj);
}

formulario__btn.addEventListener("click", () => {
  const nuevoUsuario = new registro(
    usuario.value,
    nombre.value,
    password.value,
    correo.value,
    telefono.value
  );
  console.log(nuevoUsuario);
});
