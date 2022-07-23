const resultContainer = document.getElementById('result');

var latestQuery;

function onScanSuccess(decodedText, decodedResult) {
  if (decodedText !== latestQuery) {
    latestQuery = decodedText;
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

function onScanFailure() {}

let html5QrcodeScanner = new Html5QrcodeScanner(
  'reader',
  { fps: 10 },
  /* verbose= */ false,
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
