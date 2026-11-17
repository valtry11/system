 const templateUpload = document.getElementById("templateUpload");

const previewCanvas = document.getElementById("previewCanvas");

const previewContainer = document.getElementById("previewContainer");

const emptyPreview = document.getElementById("emptyPreview");

const nameInput = document.getElementById("nameInput");

const fontSelect = document.getElementById("fontSelect");

const fontSize = document.getElementById("fontSize");

const fontColor = document.getElementById("fontColor");

const positionX = document.getElementById("positionX");

const positionY = document.getElementById("positionY");

const generateBtn = document.getElementById("generateBtn");

const clearBtn = document.getElementById("clearBtn");

const resultsSection = document.getElementById("resultsSection");

const results = document.getElementById("results");

const ctx = previewCanvas.getContext("2d");


let certificateImage = null;



let nameX = 0;

let nameY = 0;



let isDragging = false;




templateUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }


    const reader = new FileReader();


    reader.onload = function (event) {

        const img = new Image();


        img.onload = function () {

            certificateImage = img;




            previewCanvas.width = img.width;

            previewCanvas.height = img.height;


            /*
                Put the default name position
                in the center of the certificate.
            */

            nameX = img.width / 2;

            nameY = img.height / 2;


            /*
                Show canvas.
            */

            previewCanvas.style.display = "block";

            emptyPreview.style.display = "none";


            updatePositionDisplay();

            drawPreview();

        };


        img.src = event.target.result;

    };


    reader.readAsDataURL(file);

});


/*
    Get mouse position relative
    to the actual canvas dimensions.
*/

function getCanvasPosition(event) {

    const rect = previewCanvas.getBoundingClientRect();


    const scaleX = previewCanvas.width / rect.width;

    const scaleY = previewCanvas.height / rect.height;


    return {

        x: (event.clientX - rect.left) * scaleX,

        y: (event.clientY - rect.top) * scaleY

    };

}


/*
    Click certificate to position name.
*/

previewCanvas.addEventListener("click", function (event) {

    if (!certificateImage) {
        return;
    }


    const position = getCanvasPosition(event);


    nameX = position.x;

    nameY = position.y;


    updatePositionDisplay();

    drawPreview();

});


/*
    Drag name around certificate.
*/

previewCanvas.addEventListener("mousedown", function (event) {

    if (!certificateImage) {
        return;
    }


    isDragging = true;

    moveName(event);

});


document.addEventListener("mousemove", function (event) {

    if (!isDragging) {
        return;
    }


    moveName(event);

});


document.addEventListener("mouseup", function () {

    isDragging = false;

});


function moveName(event) {

    if (!certificateImage) {
        return;
    }


    const rect = previewCanvas.getBoundingClientRect();


    /*
        Don't move if mouse is outside canvas.
    */

    if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
    ) {
        return;
    }


    const position = getCanvasPosition(event);


    nameX = position.x;

    nameY = position.y;


    updatePositionDisplay();

    drawPreview();

}


/*
    Draw certificate preview.
*/

function drawPreview() {

    if (!certificateImage) {
        return;
    }


    /*
        Clear canvas.
    */

    ctx.clearRect(
        0,
        0,
        previewCanvas.width,
        previewCanvas.height
    );


    /*
        Draw original certificate.
    */

    ctx.drawImage(
        certificateImage,
        0,
        0
    );


    /*
        Get current name.
    */

    const names = getNames();

    let previewName = "Sample Name";


    if (names.length > 0) {
        previewName = names[0];
    }


    /*
        Name settings.
    */

    ctx.font =
        `${fontSize.value}px "${fontSelect.value}"`;

    ctx.fillStyle = fontColor.value;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";


    /*
        Draw name.
    */

    ctx.fillText(
        previewName,
        nameX,
        nameY
    );


    /*
        Draw position marker.
    */

    ctx.beginPath();

    ctx.arc(
        nameX,
        nameY,
        7,
        0,
        Math.PI * 2
    );

    ctx.strokeStyle = "#007bff";

    ctx.lineWidth = 3;

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        nameX - 15,
        nameY
    );

    ctx.lineTo(
        nameX + 15,
        nameY
    );

    ctx.moveTo(
        nameX,
        nameY - 15
    );

    ctx.lineTo(
        nameX,
        nameY + 15
    );

    ctx.strokeStyle = "#007bff";

    ctx.lineWidth = 2;

    ctx.stroke();

}


/*
    Update X and Y display.
*/

function updatePositionDisplay() {

    positionX.textContent =
        Math.round(nameX);

    positionY.textContent =
        Math.round(nameY);

}


/*
    Get names from textarea.
*/

function getNames() {

    return nameInput.value

        .split("\n")

        .map(name => name.trim())

        .filter(name => name !== "");

}


/*
    Update preview whenever
    settings change.
*/

nameInput.addEventListener(
    "input",
    drawPreview
);


fontSelect.addEventListener(
    "change",
    drawPreview
);


fontSize.addEventListener(
    "input",
    drawPreview
);


fontColor.addEventListener(
    "input",
    drawPreview
);


/*
    Generate certificates.
*/

generateBtn.addEventListener("click", function () {

    if (!certificateImage) {

        alert(
            "Please upload a certificate design first."
        );

        return;

    }


    const names = getNames();


    if (names.length === 0) {

        alert(
            "Please enter at least one name."
        );

        return;

    }


    /*
        Clear old results.
    */

    results.innerHTML = "";

    resultsSection.style.display = "block";


    /*
        Generate certificate
        for every name.
    */

    names.forEach(function (name, index) {

        const canvas = document.createElement("canvas");

        const context = canvas.getContext("2d");


        canvas.width = certificateImage.width;

        canvas.height = certificateImage.height;


        /*
            Draw certificate background.
        */

        context.drawImage(
            certificateImage,
            0,
            0
        );


        /*
            Configure text.
        */

        context.font =
            `${fontSize.value}px "${fontSelect.value}"`;

        context.fillStyle =
            fontColor.value;

        context.textAlign =
            "center";

        context.textBaseline =
            "middle";


        /*
            Draw name.
        */

        context.fillText(
            name,
            nameX,
            nameY
        );


        /*
            Convert certificate
            into PNG.
        */

        const imageURL =
            canvas.toDataURL("image/png");


        /*
            Create result card.
        */

        const card =
            document.createElement("div");

        card.className =
            "result-card";


        /*
            Preview image.
        */

        const image =
            document.createElement("img");

        image.src =
            imageURL;


        /*
            Result information.
        */

        const info =
            document.createElement("div");

        info.className =
            "result-info";


        const nameLabel =
            document.createElement("div");

        nameLabel.className =
            "result-name";

        nameLabel.textContent =
            name;


        /*
            Download button.
        */

        const download =
            document.createElement("a");

        download.className =
            "download-btn";

        download.href =
            imageURL;

        download.download =
            createFileName(name);


        download.textContent =
            "Download Certificate";


        /*
            Assemble.
        */

        info.appendChild(nameLabel);

        info.appendChild(download);

        card.appendChild(image);

        card.appendChild(info);

        results.appendChild(card);

    });




    resultsSection.scrollIntoView({
        behavior: "smooth"
    });

});



function createFileName(name) {

    return name

        .replace(/[^a-z0-9]/gi, "_")

        .toLowerCase()

        + "_certificate.png";

}




clearBtn.addEventListener("click", function () {

    results.innerHTML = "";

    resultsSection.style.display = "none";

});