import { addGameVersionOptions, preloadPatternImages, onShapeSelectChange } from "./modules/ui.js";
import { submitForm } from "./modules/form.js";

document.addEventListener("DOMContentLoaded", whenDOMContentLoaded);

function whenDOMContentLoaded() {
    addGameVersionOptions()

    preloadPatternImages()

    document.getElementById('shape').addEventListener('change', onShapeSelectChange)
    document.getElementById('submit-btn').addEventListener('click', submitForm)
}




