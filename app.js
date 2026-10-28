function showPage(pageId) {

    document.querySelectorAll(".page")
        .forEach(p => p.classList.add("hidden"));

    document.getElementById(pageId)
        .classList.remove("hidden");
}

const centrali = [
    {
        nome: "Maspero 51",
        stato: "Critica",
        note: "Generatori con perdite, amianto, rete vetusta"
    },
    {
        nome: "Val Cismon 2",
        stato: "Critica",
        note: "Esondazione Seveso, alimentazione provvisoria"
    },
    {
        nome: "Uccelli di Nemi 58",
        stato: "Critica",
        note: "Rischio esondazione Lambro"
    },
    {
        nome: "Bagarotti 44",
        stato: "Strategica",
        note: "Superbonus parziale"
    }
];

function loadCentrali() {

    const container =
        document.getElementById("centraliContainer");

    container.innerHTML = "";

    centrali.forEach(c => {

        container.innerHTML += `
        <div class="card">
            <h3>${c.nome}</h3>
            <b>${c.stato}</b>
            <p>${c.note}</p>
        </div>
        `;
    });
}

function searchCentrale() {

    const text =
        document.getElementById("searchInput")
        .value
        .toLowerCase();

    const results =
        document.getElementById("searchResults");

    results.innerHTML = "";

    if(text.length < 2)
        return;

    centrali
        .filter(c =>
            c.nome.toLowerCase().includes(text))
        .forEach(c => {

            results.innerHTML += `
                <div class="card">
                    <b>${c.nome}</b>
                    <p>${c.note}</p>
                </div>
            `;
        });
}

loadCentrali();
