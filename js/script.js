document.addEventListener("DOMContentLoaded", () => {
    const inputParaula = document.getElementById("inputParaula");
    const togglePassword = document.getElementById("togglePassword");
    const btnComencar = document.getElementById("btnComencar");
    const paraulaSecreta = document.getElementById("paraulaSecreta");
    const botonsLletres = document.getElementById("botonsLletres");
    const missatge = document.getElementById("missatge");
    const intentsRestants = document.getElementById("intents");
    const puntsActuals = document.getElementById("puntsActuals");
    const millorPunts = document.getElementById("millorPunts");
    const btnReiniciar = document.getElementById("btnReiniciar");

    let paraula = "";
    let intentos = 10;
    let punts = 0;
    let millorPuntuacio = localStorage.getItem("millorPuntuacio") || 0;
    let lletresCorrectes = [];
    let encertsSeguits = 0;

    millorPunts.textContent = millorPuntuacio;

    togglePassword.addEventListener("click", () => {
        inputParaula.type = inputParaula.type === "password" ? "text" : "password";
    });

    btnComencar.addEventListener("click", () => {
        paraula = inputParaula.value.trim().toLowerCase();
        if (!paraula) {
            alert("Has d’afegir una paraula per poder començar a jugar");
            return;
        }
        if (/\d/.test(paraula)) {
            alert("La paraula no pot contenir números");
            return;
        }
        if (paraula.length < 4) {
            alert("La paraula ha de contenir més de 3 caràcters");
            return;
        }
        iniciarJoc();
    });

    btnReiniciar.addEventListener("click", reiniciarJoc);

    function iniciarJoc() {
        inputParaula.disabled = true;
        btnComencar.disabled = true;
        btnReiniciar.style.display = "none";
        lletresCorrectes = new Array(paraula.length).fill("_");
        paraulaSecreta.textContent = lletresCorrectes.join(" ");
        botonsLletres.innerHTML = "";
        punts = 0;
        encertsSeguits = 0;
        intentos = 10;
        missatge.textContent = "Intenta encertar la paraula!";
        actualitzarPantalla();
        crearBotons();
    }

    function crearBotons() {
        const alfabet = "abcdefghijklmnopqrstuvwxyz";
        alfabet.split("").forEach(lletra => {
            const btn = document.createElement("button");
            btn.textContent = lletra;
            btn.addEventListener("click", () => comprovarLletra(lletra, btn));
            botonsLletres.appendChild(btn);
        });
    }

    function comprovarLletra(lletra, boto) {
        boto.disabled = true;

        if (paraula.includes(lletra)) {
            let comptador = 0;
            for (let i = 0; i < paraula.length; i++) {
                if (paraula[i] === lletra) {
                    lletresCorrectes[i] = lletra;
                    comptador++;
                }
            }

            encertsSeguits++;
            punts += encertsSeguits * comptador;

            paraulaSecreta.textContent = lletresCorrectes.join(" ");

            if (!lletresCorrectes.includes("_")) {
                acabarJoc(true);
            }
        } else {
            encertsSeguits = 0;
            punts = Math.max(0, punts - 1);
            intentos--;

            if (intentos === 0) {
                acabarJoc(false);
            }
        }

        actualitzarPantalla();
    }

    function actualitzarPantalla() {
        intentsRestants.textContent = intentos;
        puntsActuals.textContent = punts;
    }

    function acabarJoc(guanyat) {
        missatge.textContent = guanyat ? "🎉 Felicitats! Has guanyat!" : `❌ Has perdut! La paraula era: ${paraula}`;

        if (punts > millorPuntuacio) {
            millorPuntuacio = punts;
            localStorage.setItem("millorPuntuacio", millorPuntuacio);
            millorPunts.textContent = millorPuntuacio;
        }

        botonsLletres.innerHTML = "";
        btnReiniciar.style.display = "block";
    }

    function reiniciarJoc() {
        inputParaula.disabled = false;
        btnComencar.disabled = false;
        inputParaula.value = "";
        botonsLletres.innerHTML = "";
        paraulaSecreta.textContent = "_ _ _ _";
        missatge.textContent = "Intenta encertar la paraula!";
        intentsRestants.textContent = "10";
        puntsActuals.textContent = "0";
        btnReiniciar.style.display = "none";
    }
});
