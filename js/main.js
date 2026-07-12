const boton_tema = document.getElementById("boton_tema");
const texto_tema = document.getElementById("texto_boton");
const circulo = document.getElementById("circulo");
const info_img = document.getElementById("info_img");
const info = document.getElementById("info");
const info_card = document.getElementById("info_card");


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
        info_img.src = "assets/img/info_n.png"
        circulo.classList.add("mover_circulo");
    } else {
        localStorage.setItem('theme', 'oscuro');
        texto_tema.textContent = "Modo Oscuro";
        info_img.src = "assets/img/info.png"
        circulo.classList.remove("mover_circulo");
    }
});

function mostrarCard() {
    info_card.classList.toggle("bajar")
}