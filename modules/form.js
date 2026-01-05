import { callApi } from "./api.js";
import { displayResults } from "./ui.js";

function validateForm() {
    const form = document.getElementById('finder-form');

    for (let i = 0; i < form.elements.length; i++) {
        const field = form.elements[i];

        if (field.hasAttribute('required') && field.value.trim() === '') {
            return field
        }
    }

    return true
}

function getFormData() {
    const gameVersion = document.getElementById('version').value
    const worldSeed = document.getElementById('seed').value
    const fortressSalt = document.getElementById('salt').value
    const crossroadShape = document.getElementById('shape').value
    const maxY = document.getElementById('max_y').value
    const searchRadius = document.getElementById('radius').value
    const searchCenterX = document.getElementById('center_x').value
    const searchCenterZ = document.getElementById('center_z').value

    return {
        "game_version": gameVersion,
        "world_seed": BigInt(worldSeed),
        "fortress_salt":  fortressSalt === '' ? null : BigInt(fortressSalt),
        "crossroad_shape": crossroadShape,
        "max_y": BigInt(maxY),
        "search_radius": BigInt(searchRadius),
        "search_center_x": BigInt(searchCenterX),
        "search_center_z": BigInt(searchCenterZ)
    }
}

export async function submitForm() {
    const validate = validateForm()

    if (!(validate === true)) {
        alert(`The ${validate.getAttribute('name')} field is required!`)
        return;
    }

    
    const submitButton = document.getElementById('submit-btn');
    submitButton.disabled = true;

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Searching...'

    const payload = getFormData();

    const crossroads = (await callApi(payload))["crossroads"];

    displayResults(crossroads)

    submitButton.textContent = originalText;
    submitButton.disabled = false;
}
