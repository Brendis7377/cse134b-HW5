class CatFacts extends HTMLElement {
    static observedAttributes = ["pink-border"];

    attributeChangedCallback() {
        this.classList.toggle("has-pink-border", this.hasAttribute("pink-border"));
    }

    connectedCallback() {
        const catHeading = document.createElement("h3");
        catHeading.textContent = "Cat Facts:P";

        const catFact = document.createElement("p");
        catFact.textContent = "Cats are really cute and more independent, they usually like to explore outside on their own!";

        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.textContent = "Next fact";

        const status = document.createElement("p");
        status.setAttribute("role", "status");

        nextBtn.addEventListener("click", async () => {
            status.textContent = "loading a cat fact..";

            try {
                const responses = await fetch("https://catfact.ninja/fact");

                if (!responses.ok) {
                    throw new Error(`HTTP error: ${responses.status}`);
                }

                const data = await responses.json();

                if (typeof data?.fact !== "string" || !data.fact.trim()) {
                    throw new Error("The response did not contain a cat fact.");
                }

                catFact.textContent = data.fact;
                status.textContent = "new cat fact!";
            } catch {
                status.textContent = "couldn’t load a cat fact :(. Click Next fact to try again.";
            }
        });

        this.append(catHeading, catFact, nextBtn, status);
    }
}

customElements.define("cat-facts", CatFacts);

const borderBtn = document.querySelector("#borderBtn");
const catWidget = document.querySelector("cat-facts");

const borderKey = "hw5-cat-facts-border";

function applyBorder(borderOn) {
    catWidget.toggleAttribute("pink-border", borderOn);
    borderBtn.setAttribute("aria-pressed", String(borderOn));
}

try {
    applyBorder(localStorage.getItem(borderKey) === "on");
} catch {
    applyBorder(false);
}

borderBtn.addEventListener("click", () => {
    const borderOn = !catWidget.hasAttribute("pink-border");
    applyBorder(borderOn);

    try {
        localStorage.setItem(borderKey, borderOn ? "on" : "off");
    } catch {
        
    }
});

borderBtn.hidden = false;