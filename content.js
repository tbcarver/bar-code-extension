(function() {
  console.log('Bar Code Scanning extension loaded');

  let barcodeContainer = document.createElement('div');
  barcodeContainer.setAttribute('class', 'barcode-control');
  barcodeContainer.setAttribute('style', 'position: fixed; top: 40px; right: 0; z-index: 9999; display: flex;');

  let barcodeInput = document.createElement('input');
  barcodeInput.setAttribute('type', 'text');
  barcodeInput.setAttribute('placeholder', 'Bar Code');
  barcodeInput.setAttribute('class', 'form-control');
  barcodeInput.setAttribute('style', 'width: 100px; border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: none;');

  let barcodeButton = document.createElement('button');
  barcodeButton.setAttribute('class', 'btn btn-default');
  barcodeButton.innerText = 'Scan';
  barcodeButton.setAttribute('style', 'border-top-left-radius: 0; border-bottom-left-radius: 0;');

  barcodeContainer.appendChild(barcodeInput);
  barcodeContainer.appendChild(barcodeButton);
  document.body.appendChild(barcodeContainer);

  barcodeButton.addEventListener('click', processScan);
  barcodeInput.addEventListener('keypress', function(e) {
    if (e.which === 13) {
      processScan();
    }
  });

  let callback = getCallBack();
  console.log('Bar Code Scanning callback:' + callback);

  function getCallBack() {
    return document.querySelector('[name=scannerCallback]').value;
  }

  function getInput() {
    let input = document.querySelector('.barcode-control input');
    let value = input.value;
    input.value = "";
    return value;
  }

  function processScan() {
    let barcode = getInput();

    switch (callback) {
      case 'addToCart':
      case 'receiving':
      case 'sessionCreate':
      case 'pullOrderItem':
      case 'initialCheckIn':
      case 'addItemsToShelf':
      case 'getInStationItem':
      case 'pullRequestedItem':
      case 'getAuthenticationItem':
      case 'productInfo':
      case 'restoration':
        barcode = '0' + barcode + '0';
        break;
      case 'adminReceiving':
      case 'ship':
      case 'review':
      case 'getProducts':
      case 'itemsOnShelf':
      case 'shipFromDashboard':
        // do nothing to the barcode
        break;
    }

    if (typeof scanCallbacks !== 'undefined' && typeof scanCallbacks[callback] !== 'undefined') {
      scanCallbacks[callback](barcode);
    } else if (typeof receivingScanCallbacks !== 'undefined' && typeof receivingScanCallbacks[callback] !== 'undefined') {
      receivingScanCallbacks[callback](barcode);
    } else if (typeof USBscanCallbacks !== 'undefined' && typeof USBscanCallbacks[callback] !== 'undefined') {
      USBscanCallbacks[callback](barcode);
    } else {
      window[callback](barcode);
    }
  }
})();
