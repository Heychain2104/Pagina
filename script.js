const typingText = document.getElementById("typing-text");

const text = "Log in with SecuroNova to continue";

let index = 0;
let deleting = false;

function typeWriter() {

    if (!typingText) return;

    if (!deleting) {

        typingText.textContent = text.substring(0, index + 1);

        index++;

        if (index === text.length) {

            setTimeout(() => {
                deleting = true;
                typeWriter();
            }, 2500);

            return;
        }

        setTimeout(typeWriter, 70);

    } else {

        typingText.textContent = text.substring(0, index - 1);

        index--;

        if (index === 0) {

            deleting = false;

            setTimeout(typeWriter, 700);

            return;
        }

        setTimeout(typeWriter, 35);
    }
}

typeWriter();


/* ==========================================
   BOTÓN DISCORD
   ========================================== */

const discordButton = document.getElementById("discord-login");

if (discordButton) {

    discordButton.addEventListener("click", () => {

        discordButton.classList.add("loading");

        const originalText = discordButton.innerHTML;

        discordButton.innerHTML = `
            <span>Connecting to Discord...</span>
        `;

        setTimeout(() => {

            discordButton.innerHTML = originalText;

            discordButton.classList.remove("loading");

        }, 1500);

    });

}
