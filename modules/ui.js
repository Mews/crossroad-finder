import { PATTERN_IMAGES, VERSION_RANGES } from "./constants.js";

export function preloadPatternImages() {
    // From https://stackoverflow.com/questions/3646036/preloading-images-with-javascript    
    PATTERN_IMAGES.forEach( (image) => {
        let img = new Image();
        img.src = "assets/images/patterns/"+image
    })
}


export function addGameVersionOptions() {
    let versionSelect = document.getElementById('version');
    let versions = [];

    for (let minor = 21; minor >= 7; minor--) {

        for (let patch = VERSION_RANGES[minor][1]; patch >= VERSION_RANGES[minor][0]; patch--) {
            versions.push(`1.${minor}.${patch}`)
        }

        versions.push(`1.${minor}`);
    }

    for (let i = 0; i < versions.length; i++) {
        let option = new Option(versions[i], versions[i]);
        if (i == 0) option.selected = true;
        versionSelect.add(option);
    }
}


export function onShapeSelectChange() {
    const shapeSelect = document.getElementById('shape')
    let currentShape = shapeSelect.value

    document.getElementById('pattern-image').src = 'assets/images/patterns/' + currentShape.toLowerCase() + ".png"
}


export function displayResults(crossroads) {
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
