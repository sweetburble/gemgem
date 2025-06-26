// src/ui.js

export function createButtonContainer(rect, buttonClickHandler, t) {
    const container = document.createElement("div");
    container.id = "selection-buttons";
    container.style.position = "absolute";
    container.style.left = `${window.scrollX + rect.left}px`;
    container.style.top = `${window.scrollY + rect.bottom + 10}px`;
    container.style.zIndex = "999999";

    createButtons(container, buttonClickHandler, t);
    document.body.appendChild(container);
    return container;
}

function createButtons(container, buttonClickHandler, t) {
    const buttons = [
        { text: t("summarize"), type: "summarize" },
        { text: t("translate"), type: "translate" },
        { text: t("speech"), type: "speech" },
        { text: t("settings"), type: "settings" },
    ];

    buttons.forEach(({ text, type }) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", (event) =>
            buttonClickHandler(event, type)
        );
        container.appendChild(button);
    });
}

export function showSettingsPanel(settings, saveCallback, t) {
    const overlay = document.createElement("div");
    overlay.className = "settings-overlay";
    document.body.appendChild(overlay);

    const panel = document.createElement("div");
    panel.id = "settings-panel";

    panel.innerHTML = `
        <h2>${t("settingsTitle")}</h2>
        <div class="settings-group">
            <label>${t("apiKeyLabel")}</label>
            <input type="password" id="openai-api-key" value="${settings.apiKey || ""}" placeholder="${t("apiKeyPlaceholder")}">
        </div>
        <div class="settings-group">
            <label>${t("geminiApiKeyLabel")}</label>
            <input type="password" id="gemini-api-key" value="${settings.geminiApiKey || ""}" placeholder="${t("geminiApiKeyPlaceholder")}">
        </div>
        <div class="settings-group">
            <label>${t("languageLabel")}</label>
            <select id="language">
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
                <option value="fr">Français</option>
            </select>
        </div>
        <div class="settings-group">
            <label>${t("speechSpeedLabel")}: <span id="speed-value">${settings.speechSpeed}x</span></label>
            <input type="range" id="speech-speed" min="0.25" max="4.0" step="0.25" value="${settings.speechSpeed}">
        </div>
        <div class="settings-buttons">
            <button class="cancel">${t("cancel")}</button>
            <button class="save">${t("save")}</button>
        </div>
    `;

    document.body.appendChild(panel);

    const languageSelect = panel.querySelector("#language");
    languageSelect.value = settings.language;
    languageSelect.focus();

    const speedInput = panel.querySelector("#speech-speed");
    const speedValue = panel.querySelector("#speed-value");
    speedInput.addEventListener("input", (e) => {
        speedValue.textContent = `${e.target.value}x`;
    });

    panel.querySelector(".save").addEventListener("click", async () => {
        const newSettings = {
            apiKey: panel.querySelector("#openai-api-key").value,
            geminiApiKey: panel.querySelector("#gemini-api-key").value,
            language: panel.querySelector("#language").value,
            speechSpeed: parseFloat(panel.querySelector("#speech-speed").value),
        };
        await saveCallback(newSettings);
        overlay.remove();
        panel.remove();
    });

    panel.querySelector(".cancel").addEventListener("click", () => {
        overlay.remove();
        panel.remove();
    });
}

export function createSpinner() {
    const spinnerContainer = document.createElement("div");
    spinnerContainer.id = "loading-spinner-container";
    spinnerContainer.style.position = "fixed";
    spinnerContainer.style.top = "0";
    spinnerContainer.style.left = "0";
    spinnerContainer.style.width = "100%";
    spinnerContainer.style.height = "100%";
    spinnerContainer.style.display = "flex";
    spinnerContainer.style.justifyContent = "center";
    spinnerContainer.style.alignItems = "center";
    spinnerContainer.style.zIndex = "9999999";

    const spinner = document.createElement("div");
    spinner.className = "spinner"; // CSS에서 애니메이션 정의
    spinnerContainer.appendChild(spinner);
    document.body.appendChild(spinnerContainer);
    return spinnerContainer;
}

export function showErrorDialog(message) {
    const dialog = document.createElement("div");
    dialog.className = "notify-dialog";
    dialog.textContent = message;
    document.body.appendChild(dialog);

    setTimeout(() => {
        dialog.style.animation = "slideOut 0.3s ease forwards";
        setTimeout(() => dialog.remove(), 300);
    }, 3000);
}

export function updateSelectedText(newText) {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(newText));
    }
}

export function removeExistingLayer() {
    const existingLayer = document.getElementById("selection-buttons");
    if (existingLayer) {
        existingLayer.remove();
    }
}
