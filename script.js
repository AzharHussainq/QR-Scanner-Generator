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
        width: 200,
        height: 200,
        colorDark: fgColor,
        colorLight: bgColor,
        correctLevel: QRCode.CorrectLevel.H
    });
}

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

// **Drag and Drop Scanner**
document.addEventListener("DOMContentLoaded", function () {
    let dropArea = document.getElementById("reader");

    dropArea.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropArea.style.background = "#e8e8e8";
    });

    dropArea.addEventListener("dragleave", function () {
        dropArea.style.background = "#f8f9fa";
    });

    dropArea.addEventListener("drop", function (event) {
        event.preventDefault();
        dropArea.style.background = "#f8f9fa";

        let file = event.dataTransfer.files[0];

        if (file && file.type.startsWith("image/")) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = new Image();
                img.src = e.target.result;

                let qrScanner = new Html5QrcodeScanner("reader", {
                    fps: 10,
                    qrbox: 250
                });

                qrScanner.scanFile(file, false)
                    .then((decodedText) => {
                        document.getElementById("scanResult").innerHTML = 
                            'Scanned: <a href="' + decodedText + '" target="_blank">' + decodedText + '</a>';
                    })
                    .catch(err => {
                        console.error("Scan Error:", err);
                        alert("QR Code not detected in image!");
                    });
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please drop a valid QR Code image.");
        }
    });
});
