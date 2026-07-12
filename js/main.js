const boton_tema = document.getElementById("boton_tema");
const texto_tema = document.getElementById("texto_boton");
const circulo = document.getElementById("circulo");
const info_img = document.getElementById("info_img");
const info = document.getElementById("info");
const info_card = document.getElementById("info_card");
const agregar_boton = document.getElementById("agregar_boton");
const vacio = document.getElementById("vacio");
const basura = document.getElementById("basura");
const agg_cerrar_boton = document.getElementById("agregar_cerrar_boton");
const agg_card = document.getElementById("agregar_card");
const tareas_section = document.getElementById("tareas");
const form_tarea = document.getElementById("form_tarea");
const input_nombre = document.getElementById("nombre");
const input_descripcion = document.getElementById("descripcion");
const titulo_form = document.getElementById("titulo_form");
const subir_tarea_boton = document.getElementById("subir_tarea");

const TAREAS_KEY = "tareas";
let tareaEditandoId = null;


const preferencia = window.matchMedia('(prefers-color-scheme: light)').matches;

if (preferencia) {
    document.body.classList.add('modo_claro');
    texto_tema.textContent = "Modo Oscuro";
} else if (localStorage.getItem('theme') === 'claro') {
    document.body.classList.add('modo_claro');
    texto_tema.textContent = "Modo Oscuro";
}

boton_tema.addEventListener('click', () => {
    document.body.classList.toggle('modo_claro');

    if (document.body.classList.contains('modo_claro')) {
        localStorage.setItem('theme', 'claro');
        texto_tema.textContent = "Modo Claro";
        basura.src = "assets/img/borrar_n.png"
        info_img.src = "assets/img/info_n.png"
        circulo.classList.add("mover_circulo");
    } else {
        localStorage.setItem('theme', 'oscuro');
        texto_tema.textContent = "Modo Oscuro";
        basura.src = "assets/img/borrar.png"
        info_img.src = "assets/img/info.png"
        circulo.classList.remove("mover_circulo");
    }
    renderizarTareas();
});

function mostrarCard() {
    info_card.classList.toggle("bajar");
}

function abrirAgregar() {
    tareaEditandoId = null;
    form_tarea.reset();
    titulo_form.textContent = "Agregar Tarea";
    subir_tarea_boton.textContent = "Agregar Tarea";
    agg_card.classList.remove("bajar");
}

function cerrarFormulario() {
    agg_card.classList.add("bajar");
    tareaEditandoId = null;
    form_tarea.reset();
}

/* CRUD de tareas  */

function obtenerTareas() {
    const datos = localStorage.getItem(TAREAS_KEY);
    return datos ? JSON.parse(datos) : [];
}

function guardarTareas(tareas) {
    localStorage.setItem(TAREAS_KEY, JSON.stringify(tareas));
}

function generarId() {
    return (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString());
}

function crearTarea(nombre, descripcion) {
    const tareas = obtenerTareas();
    tareas.push({
        id: generarId(),
        nombre: nombre,
        descripcion: descripcion,
        completada: false
    });
    guardarTareas(tareas);
}

function actualizarTarea(id, nombre, descripcion) {
    const tareas = obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.nombre = nombre;
        tarea.descripcion = descripcion;
        guardarTareas(tareas);
    }
}

function eliminarTarea(id) {
    const tareas = obtenerTareas().filter(t => t.id !== id);
    guardarTareas(tareas);
    renderizarTareas();
}

function alternarCompletada(id) {
    const tareas = obtenerTareas();
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas(tareas);
        renderizarTareas();
    }
}

function editarTarea(id) {
    const tarea = obtenerTareas().find(t => t.id === id);
    if (!tarea) return;
    tareaEditandoId = id;
    input_nombre.value = tarea.nombre;
    input_descripcion.value = tarea.descripcion;
    titulo_form.textContent = "Editar Tarea";
    subir_tarea_boton.textContent = "Guardar Cambios";
    agg_card.classList.remove("bajar");
}

function esModoClaro() {
    return document.body.classList.contains("modo_claro");
}

function crearElementoTarea(tarea) {
    const div = document.createElement("div");
    div.classList.add("tarea");
    if (tarea.completada) div.classList.add("completada");
    div.dataset.id = tarea.id;

    // El fondo de la tarjeta es oscuro/azul salvo en modo claro cuando NO esta completada
    const fondoOscuro = tarea.completada || !esModoClaro();

    // --- header: nombre + menu de tres puntos ---
    const header = document.createElement("div");
    header.classList.add("tarea_header");

    const nombreP = document.createElement("p");
    nombreP.classList.add("tarea_nombre");
    nombreP.textContent = tarea.nombre;

    const menu = document.createElement("div");
    menu.classList.add("tarea_menu");

    const btnMenu = document.createElement("button");
    btnMenu.type = "button";
    btnMenu.classList.add("tarea_menu_boton");
    const imgMenu = document.createElement("img");
    imgMenu.src = fondoOscuro ? "assets/img/tres_puntos.png" : "assets/img/tres_puntos_n.png";
    if (fondoOscuro) imgMenu.classList.add("forzar_blanco");
    imgMenu.alt = "opciones";
    btnMenu.appendChild(imgMenu);

    const dropdown = document.createElement("div");
    dropdown.classList.add("tarea_menu_dropdown");

    const btnEditar = document.createElement("button");
    btnEditar.type = "button";
    btnEditar.innerHTML = `<img src="assets/img/editar.png" alt=""> Editar`;
    btnEditar.addEventListener("click", (e) => {
        e.stopPropagation();
        cerrarMenusAbiertos();
        editarTarea(tarea.id);
    });

    const btnBorrar = document.createElement("button");
    btnBorrar.type = "button";
    btnBorrar.innerHTML = `<img src="assets/img/borrar.png" alt=""> Eliminar`;
    btnBorrar.addEventListener("click", (e) => {
        e.stopPropagation();
        cerrarMenusAbiertos();
        eliminarTarea(tarea.id);
    });

    dropdown.appendChild(btnEditar);
    dropdown.appendChild(btnBorrar);

    btnMenu.addEventListener("click", (e) => {
        e.stopPropagation();
        const yaAbierto = dropdown.classList.contains("mostrar");
        cerrarMenusAbiertos();
        if (!yaAbierto) dropdown.classList.add("mostrar");
    });

    menu.appendChild(btnMenu);
    menu.appendChild(dropdown);

    header.appendChild(nombreP);
    header.appendChild(menu);

    div.appendChild(header);

    // --- cuerpo: descripcion centrada en el espacio disponible ---
    const cuerpo = document.createElement("div");
    cuerpo.classList.add("tarea_cuerpo");
    if (tarea.descripcion) {
        const descP = document.createElement("p");
        descP.classList.add("tarea_descripcion");
        descP.textContent = tarea.descripcion;
        cuerpo.appendChild(descP);
    }
    div.appendChild(cuerpo);

    //  check / circulo 
    const footer = document.createElement("div");
    footer.classList.add("tarea_footer");

    const btnCheck = document.createElement("button");
    btnCheck.type = "button";
    btnCheck.classList.add("tarea_check");
    btnCheck.addEventListener("click", () => alternarCompletada(tarea.id));
    const imgCheck = document.createElement("img");
    if (tarea.completada) {
        imgCheck.src = "assets/img/check.png";
        imgCheck.classList.add("forzar_blanco");
    } else {
        imgCheck.src = fondoOscuro ? "assets/img/circulo.png" : "assets/img/circulo_n.png";
    }
    imgCheck.alt = tarea.completada ? "completada" : "pendiente";
    btnCheck.appendChild(imgCheck);

    footer.appendChild(btnCheck);
    div.appendChild(footer);

    return div;
}

function cerrarMenusAbiertos() {
    document.querySelectorAll(".tarea_menu_dropdown.mostrar").forEach(el => el.classList.remove("mostrar"));
}

document.addEventListener("click", cerrarMenusAbiertos);

function renderizarTareas() {
    const tareas = obtenerTareas();

    tareas_section.querySelectorAll(".tarea").forEach(el => el.remove());
    tareas_section.classList.toggle("con_tareas", tareas.length > 0);

    if (tareas.length === 0) {
        vacio.style.display = "flex";
    } else {
        vacio.style.display = "none";
        tareas.forEach(tarea => {
            tareas_section.appendChild(crearElementoTarea(tarea));
        });
    }
}

form_tarea.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombre = input_nombre.value.trim();
    const descripcion = input_descripcion.value.trim();

    if (!nombre) return;

    if (tareaEditandoId) {
        actualizarTarea(tareaEditandoId, nombre, descripcion);
    } else {
        crearTarea(nombre, descripcion);
    }

    cerrarFormulario();
    renderizarTareas();
});

renderizarTareas();