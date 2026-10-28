let centrali = [];

async function caricaDati() {

    const response =
        await fetch("centrali.json");

    centrali =
        await response.json();

    mostraCentrali();
}

function mostraCentrali() {

    const container =
        document.getElementById(
            "centraliContainer"
        );

    if (!container)
        return;

    container.innerHTML = "";

    centrali.forEach(c => {

        container.innerHTML += `
            <div class="card">
                <h3>${c.nome}</h3>

                <p>
                    <b>${c.lotto}</b>
                    -
                    ${c.fornitore}
                </p>

                <p>${c.sintesi}</p>

                <p>
                    ${c.tag.join(" • ")}
                </p>
            </div>
        `;
    });
}

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(p =>
            p.classList.add("hidden")
        );

    document
        .getElementById(pageId)
        .classList.remove("hidden");
}

window.onload =
    caricaDati;
