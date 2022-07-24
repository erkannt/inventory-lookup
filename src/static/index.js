import QrScanner from '/static/qr-scanner.min.js';

const videoElem = document.getElementById('reader');

const resultContainer = document.getElementById('result');

var latestQuery;

function onScanSuccess(decodedText, decodedResult) {
  if (decodedText !== latestQuery) {
    latestQuery = decodedText;

    resultContainer.innerHTML = '<div class="lds-dual-ring"></div>';

    fetch(`/item/${decodedText}`)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(
            'Looks like there was a problem. Status Code: ' + response.status,
          );
          return;
        }

        response.text().then(function (text) {
          resultContainer.innerHTML = `
        <p>${text}</p>
      `;
        });
      })
      .catch(function (err) {
        resultContainer.innerHTML = `
        <h2>Ooops</h2>
        <p>Failed to get response from backend.</p>
      `;
      });
  }
}

const qrScanner = new QrScanner(
  videoElem,
  (result) => onScanSuccess(result.data),
  {
    preferredCamera: 'environment',
    highlightScanRegion: true,
    highlightCodeOutline: true,
  },
);

qrScanner.start();
