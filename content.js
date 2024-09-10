(function() {
  console.log('Bar Code Scanning extension loaded');

  let callback = getCallBack();
  console.log(callback);

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

  function processCreditCard() {
    let inputs = document.querySelectorAll('.creditcard-control input');
    let data = Array.from(inputs).map(input => input.value);
    let chName = data[3] + ' ' + data[4];
    stBrowserDidReadFinancialCardData(data[0], chName, data[1], data[2], data[3], data[4], '0');
  }

  let htmlBarCodeScan = document.createElement('div');
  htmlBarCodeScan.className = 'form-inline';

  let barcodeControl = document.createElement('div');
  barcodeControl.className = 'barcode-control input-group';
  barcodeControl.style.border = '1px solid #e7e7e7';

  let barcodeInput = document.createElement('input');
  barcodeInput.type = 'text';
  barcodeInput.className = 'form-control';
  barcodeInput.placeholder = 'bar code';
  barcodeInput.style.width = '100px';

  let buttonGroup = document.createElement('span');
  buttonGroup.className = 'input-group-btn';

  let barcodeButton = document.createElement('button');
  barcodeButton.className = 'btn btn-default';
  barcodeButton.innerHTML = 'Scan';

  barcodeControl.appendChild(barcodeInput);
  barcodeControl.appendChild(buttonGroup);
  buttonGroup.appendChild(barcodeButton);
  htmlBarCodeScan.appendChild(barcodeControl);

  let htmlCreditCardScan = document.createElement('div');
  htmlCreditCardScan.className = 'form-inline';
  htmlCreditCardScan.style.float = 'right';

  let creditCardControl = document.createElement('div');
  creditCardControl.className = 'creditcard-control';
  creditCardControl.style = 'padding:5px;float:left;';

  let creditCardFields = [
    { class: 'form-control', placeholder: 'Card #', name: 'acct', value: '4111111111111111' },
    { class: 'form-control', placeholder: 'MM', name: 'expMonth', style: 'width:50px', value: '12' },
    { class: 'form-control', placeholder: 'YYYY', name: 'expYear', style: 'width:60px', value: '2020' },
    { class: 'form-control', placeholder: 'First Name', name: 'fName', value: 'Joe' },
    { class: 'form-control', placeholder: 'Last Name', name: 'lName', value: 'Person' }
  ];

  creditCardFields.forEach(field => {
    let input = document.createElement('input');
    Object.assign(input, field);
    creditCardControl.appendChild(input);
  });

  let creditCardButton = document.createElement('button');
  creditCardButton.className = 'btn btn-default';

  let creditCardIcon = document.createElement('i');
  creditCardIcon.className = 'fa fa-credit-card';

  creditCardButton.appendChild(creditCardIcon);
  creditCardControl.appendChild(creditCardButton);
  htmlCreditCardScan.appendChild(creditCardControl);

  let pluginForm = document.createElement('div');
  pluginForm.className = 'plugin-container';

  if (typeof callback !== 'undefined') {
    let pluginRight = document.createElement('div');
    pluginRight.style.float = 'right';
    pluginRight.appendChild(htmlBarCodeScan);
    pluginForm.appendChild(pluginRight);

    if (callback === 'addToCart') {
      pluginForm.appendChild(htmlCreditCardScan);
    }
  }

  document.body.appendChild(pluginForm);

  barcodeButton.addEventListener('click', processScan);
  barcodeInput.addEventListener('keypress', function(e) {
    if (e.which === 13) {
      processScan();
    }
  });

  creditCardButton.addEventListener('click', processCreditCard);
})();
