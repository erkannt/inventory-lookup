const resultContainer = document.getElementById('result')

function onScanSuccess(decodedText, decodedResult) {
  fetch('/item/383')
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
      `
      });
    })
    .catch(function (err) {
      resultContainer.innerHTML = `
        <p>Failed to get item</p>
      `
    });
}

function onScanFailure() {}

let html5QrcodeScanner = new Html5QrcodeScanner(
  'reader',
  { fps: 10 },
  /* verbose= */ false,
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);
