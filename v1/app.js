let centrali = [];

async function caricaDati() {

    const response = await fetch("./centrali.json");

    centrali = await response.json();

    renderCentrali();
}

function renderCentrali() {

    const container =
        document.getElementById("centraliContainer");

    if (!container) return;

    container.innerHTML = "";

    centrali.forEach(centrale => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${centrale.nome}</h3>

            <p>
                <strong>${centrale.lotto}</strong>
            </p>

            <p>
                Fornitore:
                ${centrale.fornitore}
            </p>

            <p>
                Stato:
                ${centrale.stato}
            </p>

            <p>
                ${centrale.sintesi}
            </p>
        `;

        container.appendChild(card);
    });
}

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(page => {
            page.classList.remove("active");
        });

    document
        .getElementById(pageId)
        .classList.add("active");
}

window.showPage = showPage;

window.onload = async () => {

    await caricaDati();

    showPage("dashboard");
};
