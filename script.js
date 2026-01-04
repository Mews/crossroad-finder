document.addEventListener("DOMContentLoaded", whenDOMContentLoaded);


function whenDOMContentLoaded() {
    addGameVersionOptions()

    preloadPatternImages()

    const shapeSelect = document.getElementById('shape')
    shapeSelect.addEventListener('change', onShapeSelectChange)
}


function preloadPatternImages() {
    // From https://stackoverflow.com/questions/3646036/preloading-images-with-javascript

    const images = ["double_line.png", "quad_line.png", "quad_square.png", 
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
