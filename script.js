document.addEventListener("DOMContentLoaded", whenDOMContentLoaded);


function whenDOMContentLoaded() {
    addGameVersionOptions()

    preloadPatternImages()

    const shapeSelect = document.getElementById('shape')
    shapeSelect.addEventListener('change', onShapeSelectChange)
}


function preloadPatternImages() {
    // From https://stackoverflow.com/questions/3646036/preloading-images-with-javascript

    const images = ["double.png", "quad_line.png", "quad_square.png", 
        "quint_blob.png", "quint_line.png", "triple_corner.png", "triple_line.png"]
    
    images.forEach( (image) => {
        let img = new Image();
        img.src = "assets/images/patterns/"+image
    })
}


function addGameVersionOptions() {
    const versionRanges = {
        21: [1, 11],
        20: [1, 6],
        19: [1, 4],
        18: [1, 2],
        17: [1, 1],
        16: [1, 5],
        15: [1, 2],
        14: [1, 4],
        13: [1, 2],
        12: [1, 2],
        11: [1, 2],
        10: [1, 2],
        9: [1, 4],
        8: [1, 9],
        7: [1, 10],
    }

    let versionSelect = document.getElementById('version');
    let versions = [];

    for (let minor = 21; minor >= 7; minor--) {

        for (let patch = versionRanges[minor][1]; patch >= versionRanges[minor][0]; patch--) {
            versions.push(`1.${minor}.${patch}`)
        }

        versions.push(`1.${minor}`);
    }

    for (let i = 0; i < versions.length; i++) {
        option = new Option(versions[i], versions[i]);
        if (i == 0) option.selected = true;
        versionSelect.add(option);
    }
}


function onShapeSelectChange() {
    const shapeSelect = document.getElementById('shape')
    let currentShape = shapeSelect.value

    document.getElementById('pattern-image').src = 'assets/images/patterns/' + currentShape.toLowerCase() + ".png"
}


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
    gameVersion = document.getElementById('version').value
    worldSeed = document.getElementById('seed').value
    fortressSalt = document.getElementById('salt').value
    crossroadShape = document.getElementById('shape').value
    maxY = document.getElementById('max_y').value
    searchRadius = document.getElementById('radius').value
    searchCenterX = document.getElementById('center_x').value
    searchCenterZ = document.getElementById('center_z').value

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


async function callApi(payload) {
    BigInt.prototype.toJSON = function () {
        return this.toString();
    };

    const api = 'https://mews.pythonanywhere.com/crossroad-finder/'

    const response = await fetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    return data;
}


async function submitForm() {
    validate = validateForm()

    if (!(validateForm() === true)) {
        alert(`The ${validate.getAttribute('name')} field is required!`)
        return;
    }

    
    const submitButton = document.getElementById('submit-btn');
    submitButton.disabled = true;

    const originalText = submitButton.textContent;
    submitButton.textContent = 'Searching...'

    payload = getFormData();

    crossroads = (await callApi(payload))["crossroads"];

    displayResults(crossroads)

    submitButton.textContent = originalText;
    submitButton.disabled = false;
}


function displayResults(crossroads) {
    const resultsContainer = document.getElementById('search-results')

    resultsContainer.innerHTML = '';

    if (crossroads.length === 0) {
        resultsContainer.innerHTML = '<Label style="padding:10px; color:wheat;">No crossroads found inside range</Label>'
        return;
    }

    for (let i = 0; i < crossroads.length; i++) {
        let crossroad = crossroads[i];

        const resultRow = document.createElement('span')
        resultRow.className = 'result-row';
        resultRow.innerText = `${crossroad[0]} ${crossroad[1]} ${crossroad[2]}`;

        resultRow.addEventListener('click', ()=>copyCoordinatesToClipboard(resultRow))

        resultsContainer.appendChild(resultRow)
    }
}


function copyCoordinatesToClipboard(resultRow) {
    if (resultRow.disabled) return;

    resultRow.disabled = true;

    const coords = resultRow.innerText;

    navigator.clipboard.writeText(`/tp @s ${coords.trim()}`)

    resultRow.innerText = 'Copied!'
    resultRow.classList.add('clicked')

    setTimeout(
        () => {
            resultRow.classList.remove('clicked')
        }, 150
    )

    setTimeout(
        () => {
            resultRow.innerText = coords;
            resultRow.disabled = false;
        }, 500
    );
}


function onResultRowClicked(rowSpan) {
    console.log(rowSpan.innerText.trim());
}


