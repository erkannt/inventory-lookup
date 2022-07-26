import QrScanner from '/static/qr-scanner.min.js';

const resultContainer = document.getElementById('result');

var latestQuery;

function onScanSuccess(decodedText, decodedResult) {
  if (decodedText !== latestQuery) {
    latestQuery = decodedText;

    resultContainer.innerHTML = '<div class="lds-dual-ring"></div>';

    fetch(`/item/${decodedText}`)
      .then(function (response) {
        response.text().then(function (text) {
          resultContainer.innerHTML = `
        <p>${text}</p>
      `;
        });
      })
      .catch(function (err) {
        resultContainer.innerHTML = `
        <h1>Ooops</h1>
        <p>Failed to get response from backend.</p>
      `;
      });
  }
}

const videoElem = document.getElementById('reader');

if (videoElem) {
  const qrScanner = new QrScanner(
    videoElem,
    (result) => onScanSuccess(result.data),
    {
      preferredCamera: 'environment',
      highlightScanRegion: true,
      highlightCodeOutline: true,
    },
  );
  const startCameraButton = document.getElementById('start-camera');

  function launchScanner() {
    qrScanner.start();
    resultContainer.innerHTML = `
      Bitte QR Code vor die Kamera halten.
    `;
  }

  startCameraButton.addEventListener('click', launchScanner);
}

const manualRequestForm = document.getElementById('manual-query');

if (manualRequestForm) {
  function manualRequest(event) {
    event.preventDefault();
    onScanSuccess(manualRequestForm.elements['query'].value);
    manualRequestForm.reset();
  }

  manualRequestForm.addEventListener('submit', manualRequest);
}
