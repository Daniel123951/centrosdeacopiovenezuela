// ===============================
// 🔥 CONFIGURACIÓN FIREBASE
// ===============================

// ⚠️ AQUÍ PEGA TU CONFIG DE FIREBASE


const firebaseConfig = {
  apiKey: "AIzaSyChUJmt3XD_a7ohI9-MshPyAWRNu2oxXuM",
  authDomain: "mapa-solidario-venezuela.firebaseapp.com",
  projectId: "mapa-solidario-venezuela",
  storageBucket: "mapa-solidario-venezuela.firebasestorage.app",
  messagingSenderId: "1099170285117",
  appId: "1:1099170285117:web:50da9e979dbee8b24c4c54"




  
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let centros = [];

// ===============================
// 💾 GUARDAR CENTRO
// ===============================
function guardarCentro() {
  const nombre = document.getElementById("nombre").value;
  const direccion = document.getElementById("direccion").value;
  const telefono = document.getElementById("telefono").value;
  const ciudad = document.getElementById("ciudad").value;
  const nota = document.getElementById("nota").value;
  const whatsapp = document.getElementById("whatsapp").value;

  if (!nombre || !direccion) {
    alert("Completa al menos nombre y dirección");
    return;
  }

  db.collection("centros").add({
    nombre,
    direccion,
    telefono,
    ciudad,
    nota,
    whatsapp,
    fecha: new Date()
  });

  alert("Centro agregado correctamente");

  document.querySelectorAll("input").forEach(i => i.value = "");
}

// ===============================
// 📥 LEER CENTROS EN TIEMPO REAL
// ===============================
db.collection("centros").orderBy("fecha", "desc")
  .onSnapshot(snapshot => {
    centros = [];
    snapshot.forEach(doc => {
      centros.push({ id: doc.id, ...doc.data() });
    });
    mostrarCentros(centros);
  });

// ===============================
// 🧾 MOSTRAR CENTROS
// ===============================
function mostrarCentros(data) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  data.forEach(c => {
    lista.innerHTML += `
      <div class="bg-white/10 p-4 rounded-lg shadow">

        <h3 class="text-lg font-bold">${c.nombre}</h3>
        <p>📍 ${c.direccion}</p>
        <p>🏙️ ${c.ciudad}</p>
        <p>📞 ${c.telefono}</p>
        <p>📝 ${c.nota}</p>

        <div class="flex gap-2 mt-3 flex-wrap">

          <a class="bg-blue-500 px-3 py-1 rounded"
             href="https://wa.me/${c.whatsapp}" target="_blank">
             WhatsApp
          </a>

          <a class="bg-green-500 px-3 py-1 rounded"
             href="https://www.google.com/maps/search/?api=1&query=${c.direccion}" target="_blank">
             Maps
          </a>

          <button onclick="eliminarCentro('${c.id}')"
            class="bg-red-600 px-3 py-1 rounded">
            Eliminar
          </button>

          <button onclick="editarCentro('${c.id}')"
            class="bg-yellow-500 px-3 py-1 rounded">
            Editar
          </button>

        </div>
      </div>
    `;
  });
}
// ===============================
// 🔍 BUSCADOR
// ===============================
function filtrar() {
  const texto = document.getElementById("buscar").value.toLowerCase();

  const filtrados = centros.filter(c =>
    (c.nombre || "").toLowerCase().includes(texto) ||
    (c.ciudad || "").toLowerCase().includes(texto) ||
    (c.direccion || "").toLowerCase().includes(texto)
  );

  mostrarCentros(filtrados);
}


function eliminarCentro(id) {
  if (confirm("¿Seguro que quieres eliminar este centro?")) {
    db.collection("centros").doc(id).delete()
      .then(() => {
        alert("Centro eliminado");
      });
  }
}

function editarCentro(id) {
  const nuevoNombre = prompt("Nuevo nombre:");
  const nuevaDireccion = prompt("Nueva dirección:");
  const nuevaCiudad = prompt("Nueva ciudad:");
  const nuevoTelefono = prompt("Nuevo teléfono:");
  const nuevaNota = prompt("Nueva nota:");

  if (!nuevoNombre) return;

  db.collection("centros").doc(id).update({
    nombre: nuevoNombre,
    direccion: nuevaDireccion,
    ciudad: nuevaCiudad,
    telefono: nuevoTelefono,
    nota: nuevaNota
  })
  .then(() => {
    alert("Centro actualizado correctamente");
  });
}
