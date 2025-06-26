// src/main.js

import { callGemini, callOpenAIForSpeech } from "./api.js";
import {
    createButtonContainer,
    showSettingsPanel,
    createSpinner,
    showErrorDialog,
    updateSelectedText,
    removeExistingLayer,
} from "./ui.js";

class TextSelectionManager {
    constructor() {
        this.selectedRange = null;
        this.settings = {
            apiKey: null,
            geminiApiKey: null,
            language: "ko",
            speechSpeed: 1.4,
        };
        this.extensionEnabled = true;
        this.translations = window.translations || {};

        this.init();
    }

    async init() {
        await this.loadSettings();
        this.addEventListeners();
        this.listenForToggle();
        this.initializeStyles();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get([
                "OPENAI_API_KEY",
                "GEMINI_API_KEY",
                "LANGUAGE",
                "SPEECH_SPEED",
                "extensionEnabled",
            ]);
            this.settings.apiKey = result.OPENAI_API_KEY;
            this.settings.geminiApiKey = result.GEMINI_API_KEY;
            this.settings.language = result.LANGUAGE || "ko";
            this.settings.speechSpeed = result.SPEECH_SPEED || 1.4;
            this.extensionEnabled =
                result.extensionEnabled !== undefined
                    ? result.extensionEnabled
                    : true;
        } catch (error) {
            showErrorDialog(`Error loading settings: ${error.message}`);
        }
    }

    t(key) {
        const lang = this.settings.language;
        return (
            (this.translations[lang] && this.translations[lang][key]) ||
            (this.translations["en"] && this.translations["en"][key]) ||
            key
        );
    }

    addEventListeners() {
        document.addEventListener("mouseup", this.handleMouseUp.bind(this));
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener(
            "selectionchange",
            this.handleSelectionChange.bind(this)
        );
        window.addEventListener("scroll", this.handleScroll.bind(this));
    }

    removeEventListeners() {
        document.removeEventListener("mouseup", this.handleMouseUp.bind(this));
        document.removeEventListener("keydown", this.handleKeyDown.bind(this));
        document.removeEventListener(
            "selectionchange",
            this.handleSelectionChange.bind(this)
        );
        window.removeEventListener("scroll", this.handleScroll.bind(this));
    }

    listenForToggle() {
        chrome.runtime.onMessage.addListener((message) => {
            if (message.type === "TOGGLE_EXTENSION") {
                this.extensionEnabled = message.enabled;
                if (this.extensionEnabled) {
                    this.addEventListeners();
                } else {
                    this.removeEventListeners();
                    removeExistingLayer();
                }
            }
        });
    }

    initializeStyles() {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = chrome.runtime.getURL("styles.css");
        document.head.appendChild(link);
    }

    handleMouseUp(e) {
        if (
            !this.extensionEnabled ||
            e.target.closest("#selection-buttons, #settings-panel")
        ) {
            return;
        }
        removeExistingLayer();

        const selectedText = window.getSelection().toString();
        if (!selectedText) return;

        const range = window.getSelection().getRangeAt(0);
        this.selectedRange = range;
        const rect = range.getBoundingClientRect();

        createButtonContainer(rect, this.handleButtonClick.bind(this), this.t.bind(this));
    }

    handleScroll() {
        if (
            this.selectedRange &&
            document.getElementById("selection-buttons")
        ) {
            const rect = this.selectedRange.getBoundingClientRect();
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                removeExistingLayer();
                return;
            }
            const container = document.getElementById("selection-buttons");
            container.style.left = `${window.scrollX + rect.left}px`;
            container.style.top = `${window.scrollY + rect.bottom + 10}px`;
        }
    }

    async handleButtonClick(event, buttonType) {
        event.stopPropagation();

        if (buttonType === "settings") {
            removeExistingLayer(); // Remove selection buttons
            showSettingsPanel(this.settings, this.saveSettings.bind(this), this.t.bind(this));
            return;
        }

        if (!this.settings.apiKey || !this.settings.geminiApiKey) {
            showErrorDialog(this.t("noApiKey"));
            return;
        }

        const currentSelectedText = window.getSelection().toString();
        if (!currentSelectedText) {
            showErrorDialog(this.t("noSelection"));
            return;
        }

        const spinner = createSpinner();

        try {
            switch (buttonType) {
                case "summarize":
                    await this.handleSummarize(currentSelectedText);
                    break;
                case "translate":
                    await this.handleTranslate(currentSelectedText);
                    break;
                case "speech":
                    await this.handleSpeech(currentSelectedText);
                    break;
            }
        } catch (error) {
            showErrorDialog(`Error: ${error.message}`);
        } finally {
            spinner.remove();
        }
    }

    async saveSettings(newSettings) {
        try {
            await chrome.storage.sync.set({
                OPENAI_API_KEY: newSettings.apiKey,
                GEMINI_API_KEY: newSettings.geminiApiKey,
                LANGUAGE: newSettings.language,
                SPEECH_SPEED: newSettings.speechSpeed,
            });
            this.settings = newSettings;
            showErrorDialog(this.t("settingsSaved"));
        } catch (error) {
            showErrorDialog(`Error saving settings: ${error.message}`);
        }
    }

    async handleSummarize(text) {
        const response = await callGemini(
            this.settings.geminiApiKey,
            "Summarize",
            text,
            this.settings.language
        );
        updateSelectedText(response);
    }

    async handleTranslate(text) {
        const response = await callGemini(
            this.settings.geminiApiKey,
            "Translate",
            text,
            this.settings.language
        );
        updateSelectedText(response);
    }

    async handleSpeech(text) {
        await callOpenAIForSpeech(
            this.settings.apiKey,
            text,
            this.settings.speechSpeed
        );
    }

    handleKeyDown(e) {
        if (e.key === "Escape") {
            removeExistingLayer();
            const settingsPanel = document.getElementById("settings-panel");
            const overlay = document.querySelector(".settings-overlay");
            if (settingsPanel) settingsPanel.remove();
            if (overlay) overlay.remove();
        }
    }

    handleSelectionChange() {
        // Do not close the settings panel when text selection changes
        if (document.getElementById("settings-panel")) {
            return;
        }
        if (!window.getSelection().toString()) {
            removeExistingLayer();
            this.selectedRange = null;
        }
    }
}

new TextSelectionManager();
