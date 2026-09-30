const url = "/api/Auto";

function ObtenerAutos() {
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((data) => {
      console.log(data);
      mostrarAutos(data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function mostrarAutos(data) {
  const tbody = document.getElementById("tablaAuto");
  tbody.innerHTML = "";

  data.forEach((element) => {
    let tr = tbody.insertRow();

    tr.insertCell(0).textContent = element.marca; // insertamos en celda

    tr.insertCell(1).textContent = element.modelo;

    tr.insertCell(2).textContent = element.anio;

    tr.insertCell(3).textContent = element.patente.toUpperCase();

    tr.insertCell(4).textContent = element.km;

    tr.insertCell(5).textContent = element.fechaIngreso.split("T")[0];

    tr.insertCell(6).textContent = element.disponible ? "Sí" : "No";

    let editar = document.createElement("button"); 
    editar.textContent = "Editar"; 
    editar.classList.add("btn", "btn-primary", "me-2"); 

    editar.setAttribute("onclick", `BuscarValoresAuto(${element.autoID})`);

    let eliminar = document.createElement("button");
    eliminar.textContent = "Eliminar";
    eliminar.classList.add("btn", "btn-danger");

    eliminar.setAttribute("onclick", `EliminarAuto(${element.autoID})`);

    let tdAcciones = tr.insertCell(7);
    tdAcciones.appendChild(editar); 
    tdAcciones.appendChild(eliminar);
  });
}

function AgregarAuto() {
  var nuevoAuto = {
    marca: document.getElementById("marca").value,
    modelo: document.getElementById("modelo").value,
    anio: parseInt(document.getElementById("anio").value),
    patente: document.getElementById("patente").value,
    km: parseInt(document.getElementById("km").value),
    fechaIngreso: document.getElementById("fechaIngreso").value,
    disponible: document.getElementById("disponible").checked,
  };

  if (
    nuevoAuto.marca == "" ||
    nuevoAuto.modelo == "" ||
    isNaN(nuevoAuto.anio) ||
    nuevoAuto.patente == "" ||
    isNaN(nuevoAuto.km) ||
    nuevoAuto.fechaIngreso == ""
  ) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  fetch(url, {
    method: "POST",

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(nuevoAuto),
  })
    .then((respuesta) => {
      if (respuesta.ok) {
        document.getElementById("marca").value = "";
        document.getElementById("modelo").value = "";
        document.getElementById("anio").value = "";
        document.getElementById("patente").value = "";
        document.getElementById("km").value = "";
        document.getElementById("fechaIngreso").value = "";
        document.getElementById("disponible").checked = true;
        ObtenerAutos();
      } else {
        respuesta.text().then((mensaje) => alert(mensaje));
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function BuscarValoresAuto(id) {
  fetch(`${url}/${id}`)
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then((data) => {
      console.log("Auto:", data);

      document.getElementById("idEditar").value = data.autoID;
      document.getElementById("marcaEditar").value = data.marca;
      document.getElementById("modeloEditar").value = data.modelo;
      document.getElementById("anioEditar").value = data.anio;
      document.getElementById("patenteEditar").value = data.patente;
      document.getElementById("kmEditar").value = data.km;
      document.getElementById("fechaIngresoEditar").value =
        data.fechaIngreso.split("T")[0];
      document.getElementById("disponibleEditar").checked = data.disponible;

      let modal = new bootstrap.Modal(document.getElementById("modalEditar"));

      modal.show();
    })
    .catch((error) => {
      console.error("No se pudo acceder a la API:", error);
    });
}

function EditarAuto() {
  let id = document.getElementById("idEditar").value;
  console.log("id", id);

  let editarAuto = {
    autoID: parseInt(id),
    marca: document.getElementById("marcaEditar").value,
    modelo: document.getElementById("modeloEditar").value,
    anio: parseInt(document.getElementById("anioEditar").value),
    patente: document.getElementById("patenteEditar").value,
    km: parseInt(document.getElementById("kmEditar").value),
    fechaIngreso: document.getElementById("fechaIngresoEditar").value,
    disponible: document.getElementById("disponibleEditar").checked,
  };

  if (
    editarAuto.marca == "" ||
    editarAuto.modelo == "" ||
    isNaN(editarAuto.anio) ||
    editarAuto.patente == "" ||
    isNaN(editarAuto.km) ||
    editarAuto.fechaIngreso == ""
  ) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editarAuto),
  })
    .then((respuesta) => {
      if (respuesta.ok) {
        let modal = bootstrap.Modal.getOrCreateInstance(
          document.getElementById("modalEditar"),
        );

        modal.hide();
        ObtenerAutos();
      } else {
        respuesta.text().then((mensaje) => alert(mensaje));
      }
    })
    .catch((error) => console.error("No se pudo editar el auto.", error));
}

function EliminarAuto(id) {
  if (!confirm("¿Desea eliminar el auto?")) {
    return;
  }

  fetch(`${url}/${id}`, {
    method: "DELETE",
  })
    .then((respuesta) => {
      if (respuesta.ok) {
        ObtenerAutos();
      } else {
        respuesta.text().then((mensaje) => alert(mensaje));
      }
    })
    .catch((error) => console.error("No se pudo eliminar el auto.", error));
}

ObtenerAutos();
