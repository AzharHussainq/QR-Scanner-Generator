// QR Code Generator Function
function generateQR() {
    let text = document.getElementById("qrText").value;
    let fgColor = document.getElementById("fgColor").value;
    let bgColor = document.getElementById("bgColor").value;

    if (text.trim() === "") {
        alert("Please enter text or URL");
        return;
    }

    let qrContainer = document.getElementById("qrCode");
    qrContainer.innerHTML = "";

    let qr = new QRCode(qrContainer, {
        text: text,
        width: 250,
        height: 250,
        colorDark: fgColor,
        colorLight: bgColor
    });
}

// QR Code Download Function
function downloadQR() {
    let qrCanvas = document.querySelector("#qrCode canvas");
    if (qrCanvas) {
        let link = document.createElement("a");
        link.href = qrCanvas.toDataURL("image/png");
        link.download = "QRCode.png";
        link.click();
    } else {
        alert("Generate a QR Code first!");
    }
}

// QR Code Scanner Function
function startScanner() {
    let reader = document.getElementById("reader");
    reader.innerHTML = "";

    let scanner = new Html5Qrcode("reader");

    Html5Qrcode.getCameras().then(devices => {
        if (devices.length > 0) {
            let cameraId = devices[0].id;
            scanner.start(
                cameraId,
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    document.getElementById("scanResult").innerHTML = 
                        'Scanned: <a href="' + decodedText + '" target="_blank">' + decodedText + '</a>';
                    scanner.stop();
                },
                (error) => {
                    console.log("Scanning...");
                }
            ).catch(err => {
                console.error("Scanner Error: ", err);
            });
        } else {
            alert("No camera found!");
        }
    }).catch(err => {
        console.error("Camera Access Error: ", err);
        alert("Camera access denied! Please allow camera permissions.");
    });
}

// Drag & Drop for QR Code Image Upload
function allowDrop(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    
    let files = event.dataTransfer.files;
    if (files.length > 0) {
        let file = files[0];

        if (!file.type.startsWith("image/")) {
            alert("Please drop an image file!");
            return;
        }

        let reader = new FileReader();
        reader.onload = function (e) {
            let imageDataUrl = e.target.result;
            scanQRCodeFromImage(imageDataUrl);
        };
        reader.readAsDataURL(file);
    }
}

// QR Code Image Scanner
function scanQRCodeFromImage(imageDataUrl) {
    let html5QrCode = new Html5Qrcode("reader");
    html5QrCode.scanFile(imageDataUrl, true)
        .then(decodedText => {
            document.getElementById("scanResult").innerHTML = 
                'Scanned: <a href="' + decodedText + '" target="_blank">' + decodedText + '</a>';
        })
        .catch(err => {
            console.error("QR Scan Error: ", err);
            alert("Unable to scan QR Code from the image!");
        });
}
