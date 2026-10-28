async function caricaCentrali() {

    const response =
        await fetch("centrali.json");

    const centrali =
        await response.json();

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
                    <strong>${c.lotto}</strong>
                </p>

                <p>
                    Fornitore:
                    ${c.fornitore}
                </p>

                <p>
                    Livello:
                    ${c.livello}
                </p>

                <p>
                    ${c.sintesi}
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

window.onload = caricaCentrali;
