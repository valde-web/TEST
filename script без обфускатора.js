// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const firebaseConfig = {
  apiKey: "AIzaSyCJ5dsUca2H-fChIAqVDMmzrwbQDLt5Vc8",
  authDomain: "table-ppo.firebaseapp.com",
  databaseURL: "https://table-ppo-default-rtdb.firebaseio.com",
  projectId: "table-ppo",
  storageBucket: "table-ppo.firebasestorage.app",
  messagingSenderId: "72568325953",
  appId: "1:72568325953:web:58bd21e97d5940c107c3c0",
  measurementId: "G-GPY9784S5B"
};

    // Инициализация Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

// Функция для загрузки данных из Firebase
    function loadData(section, elementId) {
      const dataRef = database.ref(section); //  Путь к данным (например, 'automobiles')
      const itemsContainer = document.getElementById(elementId);

      dataRef.on('value', (snapshot) => {
        itemsContainer.innerHTML = ''; // Очистить контейнер

        snapshot.forEach((childSnapshot) => {
          const itemText = childSnapshot.val().text; //  Предполагается, что у каждого элемента есть поле "text"

          const itemDiv = document.createElement('div');
          itemDiv.classList.add('item');

          const itemTextDiv = document.createElement('div');
          itemTextDiv.classList.add('item-text');
          itemTextDiv.textContent = itemText;

          itemDiv.appendChild(itemTextDiv);
          itemsContainer.appendChild(itemDiv);
        });
      });
    }

    function loadCellsFromFirebase(section, targetContainerId) {
    const dataRef = database.ref(section); // Путь к данным
    const itemsContainer = document.getElementById(targetContainerId);

    if (!itemsContainer) {
      console.error(`Контейнер с ID "${targetContainerId}" для Firebase данных не найден.`);
      return;
    }

    dataRef.on('value', (snapshot) => {
      itemsContainer.innerHTML = ''; // Очистить контейнер перед загрузкой новых данных

      if (!snapshot.exists()) {
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = 'Нет данных для отображения.';
        itemsContainer.appendChild(noDataMessage);
        return;
      }

      snapshot.forEach((childSnapshot) => {
        const itemData = childSnapshot.val();
        const cellTextContent = itemData.text; // Предполагается, что у каждого элемента есть поле "text"

        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        // Опционально: можно добавить data-copy, чтобы точно знать, что копировать
        // cellDiv.dataset.copy = cellTextContent; // Текст для копирования

        const cellTextDiv = document.createElement('div');
        cellTextDiv.classList.add('cell-text'); // Класс для текста внутри cell
        cellTextDiv.textContent = cellTextContent;

        cellDiv.appendChild(cellTextDiv);
        itemsContainer.appendChild(cellDiv);
      });
    });
  }

function loadOptionsFromFirebase(section, selectElementId) {
  const dataRef = database.ref(section); // Путь к данным
  const selectElement = document.getElementById(selectElementId);

  if (!selectElement) {
    console.error(`Элемент select с ID "${selectElementId}" не найден.`);
    return;
  }

  dataRef.on('value', (snapshot) => {
    // Сохраняем текущие option в массив
    const existingOptions = Array.from(selectElement.options).map(option => ({
      value: option.value,
      text: option.text
    }));

    selectElement.innerHTML = ''; // Очистить select

    // Сначала добавляем существующие option
    existingOptions.forEach(option => {
      const newOption = document.createElement('option');
      newOption.value = option.value;
      newOption.text = option.text;
      selectElement.add(newOption);
    });

    if (!snapshot.exists()) {
      console.log('Нет новых данных в Firebase.');
      return;
    }

    snapshot.forEach((childSnapshot) => {
      const itemData = childSnapshot.val();
      const optionValue = itemData.value || itemData.text;  //  Предполагаем наличие поля "value" или используем "text"
      const optionText = itemData.text; // Предполагаем наличие поля "text"

      const newOption = document.createElement('option');
      newOption.value = optionValue;
      newOption.text = optionText;
      selectElement.add(newOption);
    });

    // Убираем дубликаты
    removeDuplicateOptions(selectElement);
  });
}

function removeDuplicateOptions(selectElement) {
    const seen = new Set();
    for (let i = 0; i < selectElement.options.length; i++) {
        const option = selectElement.options[i];
        if (seen.has(option.value)) {
            selectElement.remove(i);
            i--; // Важно уменьшить индекс после удаления элемента
        } else {
            seen.add(option.value);
        }
    }
}

    // Загрузка данных для каждой секции
    loadData('helper', 'helper');
    loadData('auto-buy', 'auto-buy');
    loadData('auto-sell', 'auto-sell');
    loadData('biz-buy', 'biz-buy');
    loadData('biz-sell', 'biz-sell');
    loadData('cloth-buy', 'cloth-buy');
    loadData('cloth-sell', 'cloth-sell');
    loadData('copter-buy', 'copter-buy');
    loadData('copter-sell', 'copter-sell');
    loadData('fish-buy', 'fish-buy');
    loadData('fish-sell', 'fish-sell');
    loadData('flag-buy', 'flag-buy');
    loadData('flag-sell', 'flag-sell');
    loadData('frame-buy', 'frame-buy');
    loadData('frame-sell', 'frame-sell');
    loadData('hello', 'hello');
    loadData('home-buy', 'home-buy');
    loadData('home-sell', 'home-sell');
    loadData('moto-buy', 'moto-buy');
    loadData('moto-sell', 'moto-sell');
    loadData('service-buy', 'service-buy');
    loadData('service-sell', 'service-sell');
    loadData('ship-buy', 'ship-buy');
    loadData('ship-sell', 'ship-sell');
    loadData('specauto-buy', 'specauto-buy');
    loadData('specauto-sell', 'specauto-sell');
    loadData('treasure-buy', 'treasure-buy');
    loadData('treasure-sell', 'treasure-sell');
    loadData('helper2', 'helper2');
    loadData('auto-buy2', 'auto-buy2');
    loadData('auto-sell2', 'auto-sell2');
    loadData('biz-buy2', 'biz-buy2');
    loadData('biz-sell2', 'biz-sell2');
    loadData('cloth-buy2', 'cloth-buy2');
    loadData('cloth-sell2', 'cloth-sell2');
    loadData('copter-buy2', 'copter-buy2');
    loadData('copter-sell2', 'copter-sell2');
    loadData('fish-buy2', 'fish-buy2');
    loadData('fish-sell2', 'fish-sell2');
    loadData('flag-buy2', 'flag-buy2');
    loadData('flag-sell2', 'flag-sell2');
    loadData('frame-buy2', 'frame-buy2');
    loadData('frame-sell2', 'frame-sell2');
    loadData('hello2', 'hello2');
    loadData('home-buy2', 'home-buy2');
    loadData('home-sell2', 'home-sell2');
    loadData('moto-buy2', 'moto-buy2');
    loadData('moto-sell2', 'moto-sell2');
    loadData('service-buy2', 'service-buy2');
    loadData('service-sell2', 'service-sell2');
    loadData('ship-buy2', 'ship-buy2');
    loadData('ship-sell2', 'ship-sell2');
    loadData('specauto-buy2', 'specauto-buy2');
    loadData('specauto-sell2', 'specauto-sell2');
    loadData('treasure-buy2', 'treasure-buy2');
    loadData('treasure-sell2', 'treasure-sell2');
    loadCellsFromFirebase('container1', 'container1');
    loadCellsFromFirebase('container2', 'container2');
    loadData('helper5', 'helper5');
    loadOptionsFromFirebase('action', 'action');
    loadOptionsFromFirebase('itemmm', 'itemmm');
    loadOptionsFromFirebase('itemm', 'itemm');
    loadOptionsFromFirebase('tuning', 'tuning');
    loadOptionsFromFirebase('price_type', 'price_type');
    loadOptionsFromFirebase('price', 'price');
    loadOptionsFromFirebase('trade', 'trade');

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const itemmSearchInput = document.getElementById('itemmSearch');
  const itemmSelect = document.getElementById('itemm');
  const toggleMaskButton = document.getElementById('toggleMaskButton');

  if (!itemmSearchInput || !itemmSelect) {
    console.error('Не найдены элементы itemmSearch или itemm. Проверьте HTML.');
    return;
  }

  let maskVisible = false; // Флаг видимости масок
  let allOptionsData = []; // Массив для хранения данных (изначальных и из Firebase)

  // Утилиты
  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const maxResults = 500;

  // Функция для загрузки данных из Firebase
  function loadOptionsFromFirebase(section, callback) {
      // Инициализация Firebase
      const app = firebase.initializeApp(firebaseConfig);
      const database = firebase.database();

    const dataRef = database.ref(section);

    dataRef.once('value', (snapshot) => { // Используем once вместо on, чтобы избежать повторных загрузок
      const firebaseData = [];

      snapshot.forEach((childSnapshot) => {
        const itemData = childSnapshot.val();
        const optionValue = itemData.value || itemData.text || ''; //  Предполагаем наличие поля "value" или "text"
        const optionText = itemData.text || optionValue || '';

        // Добавляем данные в массив, учитывая "маск"
        firebaseData.push({
          text: optionText.trim(),
          value: optionValue.trim(),
          lower: optionText.trim().toLowerCase(),
          isMask: optionText.toLowerCase().includes('маск') || optionText.toLowerCase().includes('балаклав')
        });
      });

      callback(firebaseData); // Вызываем коллбэк с данными из Firebase
    });
  }

  // Функция для отрисовки options в DOM
  function renderOptions(filteredArr, preserveValue) {
    const prev = preserveValue ? itemmSelect.value : null;

    const frag = document.createDocumentFragment();
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '(Выберите)';
    frag.appendChild(defaultOption);

    const count = Math.min(filteredArr.length, maxResults);
    for (let i = 0; i < count; i++) {
      const o = document.createElement('option');
      o.value = filteredArr[i].value;
      o.textContent = filteredArr[i].text;
      frag.appendChild(o);
    }

    itemmSelect.innerHTML = '';
        itemmSelect.appendChild(frag);

    if (prev) {
      const exists = Array.from(itemmSelect.options).some(opt => opt.value === prev);
      if (exists) itemmSelect.value = prev;
    }
  }

  // Функция для фильтрации
  function doFilter() {
    const term = itemmSearchInput.value.trim().toLowerCase();

    const filtered = allOptionsData.filter(o => {
      const passesMask = !o.isMask || maskVisible;
      const passesSearch = term === '' || o.lower.includes(term);
      return passesMask && passesSearch;
    });

    renderOptions(filtered, true);
  }

  const debouncedFilter = debounce(doFilter, 150);

  itemmSearchInput.addEventListener('input', debouncedFilter);

  // Инициализация:
  loadOptionsFromFirebase('itemm', (firebaseData) => {
    // 1) Сохраняем изначальные данные из select в allOptionsData
    const initialOptionsData = Array.from(itemmSelect.options).map(opt => ({
        text: opt.textContent.trim(),
        value: opt.value,
        lower: opt.textContent.trim().toLowerCase(),
        isMask: opt.textContent.toLowerCase().includes('маск') || opt.textContent.toLowerCase().includes('балаклав')
    }));

   // Функция для добавления данных с проверкой на дубликаты
   function addOptionWithCheck(option) {
    const isDuplicate = allOptionsData.some(existingOption => existingOption.value === option.value);
    if (!isDuplicate) {
      allOptionsData.push(option);
    }
  }
  initialOptionsData.forEach(addOptionWithCheck);
    firebaseData.forEach(addOptionWithCheck);

    // 2) Отрисовываем всё
    renderOptions(allOptionsData, false);
  });

   // --- 5) Маски
  if (toggleMaskButton) {
    toggleMaskButton.addEventListener('click', () => {
      maskVisible = !maskVisible;

      doFilter();
    });
  }
});


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  const actionSelect = document.getElementById('action');
  const itemmmSelect = document.getElementById('itemmm');
  const itemSelect = document.getElementById('itemm');
  const tuningSelect = document.getElementById('tuning');
  const priceTypeSelect = document.getElementById('price_type');
  const priceSelect = document.getElementById('price');
  const tradeSelect = document.getElementById('trade');

  const customPriceInput = document.getElementById('customPrice');
  const setPriceButton = document.getElementById('setPrice');

  const resultDiv = document.getElementById('result');
  const copyButton = document.getElementById('copyButton');
  const clearButton = document.getElementById('clearButton'); // Получаем ссылку на кнопку Стереть

  function updateResult() {
    let resultText = '';

    if (actionSelect.value) resultText += actionSelect.value + ' ';
    if (itemmmSelect.value) resultText += itemmmSelect.value + ' ';
    if (itemSelect.value) resultText += itemSelect.value + ' ';
    if (tuningSelect.value) resultText += tuningSelect.value + ' ';
    if (priceTypeSelect.value) resultText += priceTypeSelect.value + ' ';

    if (priceSelect.value === 'input') {
        // Если выбрано "Введите сумму", используем значение из поля ввода
        if(customPriceInput.value) {
          resultText += formatNumber(customPriceInput.value) + ' рублей. ';
        }
    } else if (priceSelect.value) {
        // Иначе используем значение из выпадающего списка price
        resultText += priceSelect.value + ' ';
    }
        if (tradeSelect.value) resultText += tradeSelect.value + ' ';

    resultDiv.textContent = resultText.trim();
  }

  actionSelect.addEventListener('change', updateResult);
  itemmmSelect.addEventListener('change', updateResult);
  itemSelect.addEventListener('change', updateResult);
  tuningSelect.addEventListener('change', updateResult);
  priceTypeSelect.addEventListener('change', updateResult);
  priceSelect.addEventListener('change', function() {
    if (this.value === 'input') {
      customPriceInput.style.display = 'block';
      setPriceButton.style.display = 'inline-block';
    } else {
      customPriceInput.style.display = 'none';
      setPriceButton.style.display = 'none';
      updateResult(); // Обновляем результат при выборе предустановленной цены
    }
  });

  tradeSelect.addEventListener('change', updateResult);

  setPriceButton.addEventListener('click', function() {
      if (customPriceInput.value) {
        updateResult();
        customPriceInput.value = ''; // Очищаем поле ввода
        customPriceInput.style.display = 'none';
        setPriceButton.style.display = 'none';
        priceSelect.value = ""; // Сбрасываем значение select
      } else {
        alert('Пожалуйста, введите сумму.');
      }
    });

    customPriceInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        setPriceButton.click(); // Эмулируем нажатие кнопки "Готово"
      }
    });

  copyButton.addEventListener('click', () => {
    const originalText = copyButton.textContent; // Сохраняем оригинальный текст
    copyButton.classList.add('copied'); // Добавляем класс для подсветки

    navigator.clipboard.writeText(resultDiv.textContent)
      .then(() => {
        copyButton.textContent = 'Скопировано!'; // Меняем текст (можно убрать)
        setTimeout(() => {
          copyButton.classList.remove('copied'); // Убираем подсветку
          copyButton.textContent = originalText; // Возвращаем текст (если меняли)
        }, 2000);
      })
      .catch(err => {
        console.error('Не удалось скопировать: ', err);
        //  Можно добавить отображение ошибки в интерфейсе
        copyButton.classList.remove('copied'); // Убираем класс, если была ошибка (чтобы не остаться подсвеченным навсегда)
        copyButton.textContent = 'Ошибка!'; // Например, показать ошибку (можно убрать)
        setTimeout(() => {
          copyButton.textContent = originalText; // Возвращаем текст
        }, 2000)
      });
  });
  //  Обработчик события для кнопки "Стереть"
  clearButton.addEventListener('click', () => {
    actionSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    itemmmSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    itemSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    tuningSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    priceTypeSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    priceSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    tradeSelect.selectedIndex = 0; // Вернуть значение по умолчанию (Выберите)
    customPriceInput.value = ''; // Очищаем поле ввода

    updateResult(); // Обновить отображаемый результат
  });

  function formatNumber(number) {
    const num = parseInt(number); // Преобразуем в число
    if(isNaN(num)){
       return ""; // Возвращаем пустую строку если не число
    }

    const formattedNumber = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return formattedNumber;
  }
  //------------------------------------------------ Функция поиска в Знач. с тюнингом, возможно ее надо будеть сделать одним скриптом, если маски появятся----------------------------
  function filterOptions() {
  let input, filter, select, options, i, txtValue;
  input = document.getElementById("itemmmSearch");
  filter = input.value.toUpperCase();
  select = document.getElementById("itemmm");
  options = select.getElementsByTagName("option");

  for (i = 0; i < options.length; i++) {
    txtValue = options[i].textContent || options[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1 || options[i].value.toUpperCase().indexOf(filter) > -1) { // Ищем и в value
      options[i].style.display = "";
    } else {
      options[i].style.display = "none";
    }
  }
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  // Список ID контейнеров, в которых нужно обрабатывать копирование .cell
  const targetContainerIds = ['container1', 'container2'];

  // Это гарантирует, что он будет работать для любых элементов, добавленных динамически в любой из целевых контейнеров.
  document.addEventListener('click', async (e) => {
    // 1) Проверяем, не выделил ли пользователь текст вручную (чтобы не перебивать его)
    const selection = (window.getSelection && window.getSelection().toString()) || '';
    if (selection && selection.trim().length > 0) return;

    // 2) Находим ближайший элемент с классом 'cell'
    const clickedCell = e.target.closest('.cell');
    if (!clickedCell) return; // Клик был не по ячейке

    // 3) Проверяем, находится ли найденный 'cell' внутри одного из наших целевых контейнеров
    let isInTargetContainer = false;
    for (const containerId of targetContainerIds) {
      const container = document.getElementById(containerId);
      if (container && container.contains(clickedCell)) {
        isInTargetContainer = true;
        break;
      }
    }
    if (!isInTargetContainer) return; // Если cell не находится в одном из целевых контейнеров, игнорируем клик

    // 4) Извлекаем текст для копирования
    // Приоритет: 1. data-copy атрибут на .cell, 2. текст из .cell-text
    let textToCopy = clickedCell.dataset.copy || '';
    if (!textToCopy) {
      const textElem = clickedCell.querySelector('.cell-text');
      if (textElem) {
        textToCopy = (textElem.innerText || textElem.textContent || '').trim();
      }
    }

    if (!textToCopy) return; // Нет текста для копирования

    // 5) Копируем текст в буфер обмена
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // Fallback для старых браузеров
        copyTextFallback(textToCopy);
      }

      // 6) Добавляем подсветку и убираем ее через 1.5 секунды
      clickedCell.classList.add('highlight');
      setTimeout(() => {
        clickedCell.classList.remove('highlight');
      }, 1500);

    } catch (err) {
      console.error('Не удалось скопировать текст:', err);
      // Повторная попытка fallback, если основной не сработал по какой-то причине
      try {
        copyTextFallback(textToCopy);
        clickedCell.classList.add('highlight');
        setTimeout(() => clickedCell.classList.remove('highlight'), 1500);
      } catch (err2) {
        console.error('Fallback копирования также не сработал:', err2);
      }
    }
  });

  // --- Fallback функция для копирования ---
  function copyTextFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const successful = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!successful) throw new Error('execCommand copy failed');
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Параметры debounce
  const DEBOUNCE_MS = 8;

  // Утилита debounce
  function debounce(fn, wait) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // Берёт текст для поиска из ячейки: если есть data-copy — используем его, иначе textContent
  function getCellText(cell) {
    if (!cell) return '';
    const dc = cell.dataset && cell.dataset.copy;
    if (dc !== undefined && dc !== null && String(dc).trim() !== '') {
      return String(dc).toLowerCase();
    }
    return (cell.textContent || '').toLowerCase();
  }

  // Обработчик одного поля поиска (фильтрация только в своём контейнере)
  function attachSearchToInput(inputEl) {
    const containerId = inputEl.dataset.container;
    if (!containerId) {
      console.warn('Поле поиска не содержит data-container, пропускаем:', inputEl);
      return;
    }

    const runFilter = () => {
      const container = document.getElementById(containerId);
      if (!container) {
        console.warn('Контейнер не найден:', containerId);
        return;
      }

      const searchTerm = (inputEl.value || '').trim().toLowerCase();

      // Получаем актуальный список .cell (учитываем динамическую подгрузку)
      const cells = Array.from(container.getElementsByClassName('cell'));

      // Если строка поиска пустая — просто убираем класс hidden у всех ячеек
      if (searchTerm === '') {
        cells.forEach(cell => cell.classList.remove('hidden-cell'));
        return;
      }

      // Иначе — показываем только те, которые соответствуют
      cells.forEach(cell => {
        const text = getCellText(cell);
        if (text.includes(searchTerm)) {
          cell.classList.remove('hidden-cell');
        } else {
          cell.classList.add('hidden-cell');
        }
      });
    };

    // Навешиваем с debounce
    const debounced = debounce(() => requestAnimationFrame(runFilter), DEBOUNCE_MS);
    inputEl.addEventListener('input', debounced);

    // Опционально: реагируем на очистку через Esc (если нужно)
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        inputEl.value = '';
        requestAnimationFrame(runFilter);
      }
    });
  }

  // Инициализируем для всех полей .search-input
  document.querySelectorAll('.search-input').forEach(attachSearchToInput);
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.section-header:not(.toggle-legend)');

  headers.forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement; // родитель .section
      const items = section.querySelector('.items');
      const icon = header.querySelector('.toggle-icon');

      if (items && (items.style.display === 'none' || items.classList.contains('collapsed'))) {
        // Показать содержимое
        items.style.display = 'grid';
        items.classList.remove('collapsed');
        if (icon) icon.classList.remove('collapsed'); // стрелка вверх
      } else {
        // Скрыть содержимое
        items.style.display = 'none';
        items.classList.add('collapsed');
        if (icon) icon.classList.add('collapsed'); // стрелка вниз
      }
    });
  });
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  const legendHeader = document.getElementById('legend-header');
  const legendContent = document.getElementById('legend-content');

  if (legendHeader && legendContent) {
    legendHeader.addEventListener('click', () => {
      legendContent.classList.toggle('open'); // Добавляем или удаляем класс 'open'
    });
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Можно заменить document на более стабильный контейнер, если он гарантированно не перезаписывается.
  const root = document;

  root.addEventListener('click', async (e) => {
    try {
      // 1) Если пользователь выделил текст вручную — не мешаем
      const sel = (window.getSelection && window.getSelection().toString()) || '';
      if (sel && sel.trim().length > 0) return;

      // 2) Находим ближайшую карточку или текст внутри карточки
      // Если хотите копировать только при клике по тексту — используйте .item-text в closest
      const item = e.target.closest('.item');
      if (!item) return; // клик не по карточке

      // 3) Убедимся, что элемент не перекрыт другим слоем
      const cx = e.clientX;
      const cy = e.clientY;
      const topEl = document.elementFromPoint(cx, cy);
      // Если topEl не является дочерним элементом найденной карточки — возможно overlay
      if (topEl && !item.contains(topEl) && topEl !== item) {
        console.warn('Клик перекрыт другим элементом:', topEl);
        // всё ещё можно попытаться копировать, но лучше не мешать пользователю
        // return;
      }

      // 4) Находим текст для копирования. Предпочитаем data-copy (если сервер его генерирует),
      // затем .item-text.innerText, затем текст самой карточки
      let text = item.dataset.copy || '';
      if (!text) {
        const textElem = item.querySelector('.item-text');
        if (textElem) text = (textElem.innerText || textElem.textContent || '').trim();
      }
      if (!text) {
        // как запасной вариант — берем текст всей карточки
        text = (item.innerText || item.textContent || '').trim();
      }
      if (!text) return; // нечего копировать

      // 5) Копируем: сначала Clipboard API, иначе fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        copyFallback(text);
      }

      // 6) Визуальная обратная связь
      item.classList.add('highlight');
      setTimeout(() => item.classList.remove('highlight'), 1200);

    } catch (err) {
      console.error('Ошибка копирования:', err);
      // Попытка fallback ещё раз
      try {
        const item = e.target.closest('.item');
        const text = item ? (item.dataset.copy || (item.innerText || item.textContent || '').trim()) : '';
        if (text) copyFallback(text);
      } catch (er2) {
        console.error('Fallback тоже не сработал:', er2);
      }
    }
  });

  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    if (!ok) throw new Error('execCommand copy failed');
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  document.querySelectorAll('.toggle-legend').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content) return;
      content.classList.toggle('collapsed');

      const icon = header.querySelector('.legend-icon');
      if (content.classList.contains('collapsed')) {
        icon.innerHTML = '&#9660;'; // стрелка вниз
        header.setAttribute('aria-expanded', 'false');
      } else {
        icon.innerHTML = '&#9650;'; // стрелка вверх
        header.setAttribute('aria-expanded', 'true');
      }
    });

    // Для доступности: переключение по клавише Enter или Space
    header.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  actionSelect.addEventListener('change', function() {
    if (this.value === 'Куплю') {
      priceTypeSelect.value = 'Бюджет:';
    } else if (this.value === 'Продам') {
      priceTypeSelect.value = 'Цена:';
    } else {
      priceTypeSelect.value = ''; // Сброс, если выбрано "Обменяю" или ничего не выбрано
    }
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    const tableSections = document.querySelectorAll('.table-section');

    // Ключ для хранения в localStorage
    const LAST_SELECTED_TABLE_KEY = 'lastSelectedTableId';

    // Функция, которая делает выбранную таблицу видимой и сохраняет её состояние
    function showTable(selectedTableId) {
        tableSections.forEach(tableSection => {
            tableSection.classList.add('hidden'); // Скрываем все таблицы
        });

        const selectedTable = document.getElementById(selectedTableId);
        if (selectedTable) {
            selectedTable.classList.remove('hidden'); // Показываем выбранную
            localStorage.setItem(LAST_SELECTED_TABLE_KEY, selectedTableId); // Сохраняем ID в localStorage
        }
    }

    // Обработчик кликов по элементам выпадающего списка
    dropdownContents.forEach(dropdownContent => {
        dropdownContent.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const selectedTableId = event.target.dataset.table;
                showTable(selectedTableId);
            }
        });
    });

    // --- Инициализация при загрузке страницы ---
    const storedTableId = localStorage.getItem(LAST_SELECTED_TABLE_KEY);
    
    if (storedTableId) {
        // Если есть сохраненная таблица, показываем её
        showTable(storedTableId);
    } else {
        // Если нет сохраненной таблицы (первый визит), показываем 'table1'
        showTable('table1');
    }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    const toggleControlsButton = document.getElementById('toggleControlsButton');
    const controlsContainer = document.getElementById('controlsContainer');
    const setShortcutButton = document.getElementById('setShortcutButton');
    const clearShortcutButton = document.getElementById('clearShortcutButton');
    const shortcutInput = document.getElementById('shortcutInput');
    const currentShortcutElement = document.getElementById('currentShortcut');

    let keys = [];
    const defaultInputValue = "Введите бинд...";

    // Функция для проверки доступности window.api и setShortcut
    function isApiReady() {
      return typeof window.api !== 'undefined' && typeof window.api.setShortcut === 'function';
    }

    // Функция для установки горячей клавиши, с проверкой API
    function setShortcut(newShortcut) {
      if (isApiReady()) {
        window.api.setShortcut(newShortcut);
      } else {
        console.error('window.api или window.api.setShortcut не определены.');
        // Можно добавить здесь логику обработки ошибки, например, показать сообщение пользователю
      }
    }

    toggleControlsButton.addEventListener('click', toggleControls);

    setShortcutButton.addEventListener('click', () => {
      let newShortcut = shortcutInput.value === defaultInputValue ? "" : shortcutInput.value;
      newShortcut = transliterate(newShortcut);  // Транслитерация
      setShortcut(newShortcut);  // Используем функцию setShortcut
    });

    clearShortcutButton.addEventListener('click', () => {
      keys = [];
      shortcutInput.value = defaultInputValue;
    });

    function toggleControls() {
      console.log("controlsContainer.style.display:", controlsContainer.style.display);
      if (controlsContainer.style.display === 'none') {
        controlsContainer.style.display = 'block';
        toggleControlsButton.textContent = 'Закрыть настройки бинда';
      } else {
        controlsContainer.style.display = 'none';
        toggleControlsButton.textContent = 'Настройки бинда для приложения';
      }
    }

    shortcutInput.addEventListener('focus', () => {
      if (shortcutInput.value === defaultInputValue) {
        shortcutInput.value = '';
      }
      keys = [];
      shortcutInput.style.color = '#7a7a7aff'; // При фокусе - белый
    });

    shortcutInput.addEventListener('blur', () => {
      if (shortcutInput.value === '') {
shortcutInput.value = defaultInputValue;
      }
          shortcutInput.style.color = ''; // Убираем стиль при потере фокуса (возвращает к стилю по умолчанию)
    });

    document.addEventListener('keydown', (event) => {
      if (document.activeElement === shortcutInput && keys.length < 3) {
        event.preventDefault();

        let key = event.key === ' ' ? 'Space' : event.key;

        if (event.location === 3) {
          key = 'Num' + key;
        }
        if (!keys.includes(key)) {
          keys.push(key);
          shortcutInput.value = keys.join('+');
        }
      }
    });

    // Функция для транслитерации
  function transliterate(text) {
      const transliterationMap = {
        'ё': '`', 'й': 'q', 'ц': 'w', 'у': 'e', 'к': 'r', 'е': 't', 'н': 'y', 'г': 'u', 'ш': 'i', 'щ': 'o', 'з': 'p', 'х': '[', 'ъ': ']', 
        'ф': 'a', 'ы': 's', 'в': 'd', 'а': 'f', 'п': 'g', 'р': 'h', 'о': 'j', 'л': 'k', 'д': 'l', 'ж': ';', 'э': "'", 
        'я': 'z', 'ч': 'x', 'с': 'c', 'м': 'v', 'и': 'b', 'т': 'n', 'ь': 'm', 'б': ',', 'ю': '.', '.': '/', 
        'Ё': '~', 'Й': 'Q', 'Ц': 'W', 'У': 'E', 'К': 'R', 'Е': 'T', 'Н': 'Y', 'Г': 'U', 'Ш': 'I', 'Щ': 'O', 'З': 'P', 'Х': '{', 'Ъ': '}', '/': '|', 
        'Ф': 'A', 'Ы': 'S', 'В': 'D', 'А': 'F', 'П': 'G', 'Р': 'H', 'О': 'J', 'Л': 'K', 'Д': 'L', 'Ж': ':', 'Э': '"', 
        'Я': 'Z', 'Ч': 'X', 'С': 'C', 'М': 'V', 'И': 'B', 'Т': 'N', 'Ь': 'M', 'Б': '<', 'Ю': '>', ',': '?'
      };

    let result = '';
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        result += transliterationMap[char] || char;
      }
      return result;
    }

    // Обработчик для получения текущей горячей клавиши
    if (isApiReady()) {
        window.api.onShortcutChanged((event, shortcut) => {
            currentShortcutElement.textContent = `Текущая горячая клавиша: ${shortcut}`;
            shortcutInput.value = shortcut;
              shortcutInput.style.color = ''; // Убираем стиль при получении нового значения из API
        });
    } else {
        console.warn('window.api не доступен при загрузке страницы. Обработчик onShortcutChanged не установлен.');
    }
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
    //----------- Крч, этот сркипт убрал все маски, для него есть в целом кнопка, но я её убрал, поэтому все что связано с "маск", не видимо из-за этого скрипта, убери его и все маски появятся-----------
    // Вот код этой кнопки для Поисков ППО и выше код для кнопки в таблице Выбор ППО - <button id="toggle-mask-btn">Показать объявления с "маск"</button> - <button id="toggleMaskButton">Показать Маски</button>
  document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-mask-btn');

  // Флаг: показывать ли элементы с "маск". По умолчанию — нет.
  let showMasks = false;

  // Функция: проверяет один DOM-узел (если это .item-text или .cell-text) и скрывает/показывает его
  function processTextNode(node) {
    if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
    const isTarget = node.classList && (node.classList.contains('item') || node.classList.contains('cell'));
    if (!isTarget) return;

    const text = (node.textContent || '').toLowerCase();
    if (text.includes('маск') || text.includes('балаклав')) {
      if (!showMasks) {
        node.classList.add('masked-hidden');
      } else {
        node.classList.remove('masked-hidden');
      }
    }
  }

  // Обрабатываем элемент и его потомков (на случай, если добавлен контейнер с вложенными item-text / cell-text)
  function processElementAndChildren(el) {
    if (!el) return;
    // Если сам элемент — целевой
    processTextNode(el);
    // Ищем вложенные целевые элементы
    const targets = el.querySelectorAll && el.querySelectorAll('.item-text, .cell-text');
    if (targets && targets.length) {
      targets.forEach(t => processTextNode(t));
    }
  }

  // Изначальная одноразовая проверка: существующие элементы в DOM
  function initialHide() {
    // Найдём все текущие .item-text и .cell-text и обработаем их
    const existing = document.querySelectorAll('.item-text, .cell-text');
    existing.forEach(node => processTextNode(node));
  }

  // MutationObserver: следим за добавлением узлов в документе, чтобы применить логику к новым
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      // обрабатываем добавленные узлы
      if (m.addedNodes && m.addedNodes.length) {
        m.addedNodes.forEach(added => {
          // Если добавлен элемент, обрабатываем его и его потомков
          if (added.nodeType === Node.ELEMENT_NODE) {
            processElementAndChildren(added);
          }
        });
      }
      // Если обновился текст внутри существующего узла — тоже проверим
      if (m.type === 'characterData' && m.target && m.target.parentElement) {
        processTextNode(m.target.parentElement);
      }
    }
  });

  // Начнём слежение за body, чтобы поймать добавление элементов в любые контейнеры.
  // Если у вас много динамических изменений и производительность важна, можно заменить document.body
  // на более точные контейнеры (например, container1 и container2).
  const obsConfig = { childList: true, subtree: true, characterData: true };
  observer.observe(document.body, obsConfig);

  // Инициализация: скрываем уже существующие элементы
  initialHide();

  // Кнопка переключения: показать маски и отключить кнопку
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (showMasks) return;
      showMasks = true;
      // Показать все текущие скрытые элементы
      document.querySelectorAll('.item-text.masked-hidden, .cell-text.masked-hidden').forEach(el => {
        el.classList.remove('masked-hidden');
      });
      toggleBtn.textContent = 'Объявления с "маск" показаны';
      toggleBtn.disabled = true;
    });
  } else {
    // Если кнопки нет, просто оставляем скрытыми — ничего не делаем
    console.warn('Кнопка toggle-mask-btn не найдена. Маск-элементы остаются скрытыми.');
  }
});

  // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
/* Скрипт: открытие, закрытие, выбор темы, сохранение в localStorage */
document.addEventListener('DOMContentLoaded', () => {
  const arc = document.getElementById('themeArc');
  const toggle = document.getElementById('themeToggle');
  const options = arc.querySelectorAll('.theme-option');

  // Применяет тему: 'dark' — дефолт (не добавляем класс), 'light'/'pink' добавляем класс
  function applyTheme(theme){
    document.documentElement.classList.remove('light','pink','gta'); // Меняем на document.documentElement
    if(theme && theme !== 'dark'){
      document.documentElement.classList.add(theme); // Меняем на document.documentElement
    }
    localStorage.setItem('site-theme', theme || 'dark');
  }

  // Открыть/закрыть меню
  function toggleArc(e){
    e.stopPropagation();
    arc.classList.toggle('open');
    const opened = arc.classList.contains('open');
    toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  toggle.addEventListener('click', toggleArc);

  // Клик на опцию — применяем тему и закрываем меню
  options.forEach(opt => {
    opt.addEventListener('click', (e) => {
      const theme = opt.dataset.theme;
      applyTheme(theme);
      arc.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });

    // Доступность: выбор клавишей Enter/Space
    opt.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        opt.click();
      }
    });
  });

  // Закрывать при клике вне
  document.addEventListener('click', (e) => {
    if(!arc.contains(e.target)){
      arc.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Закрыть по Esc
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      arc.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  const notification = document.getElementById('update-notification');
  const closeButton = document.getElementById('close-notification');
  const currentVersion = '1.3'; // <--  УКАЖИТЕ ТЕКУЩУЮ ВЕРСИЮ ОБНОВЛЕНИЯ

  function getCookie(name) { /* ... функция getCookie из предыдущих примеров ... */ }
  function setCookie(name, value, days) { /* ... функция setCookie из предыдущих примеров ... */ }

  if (localStorage.getItem('updateVersion') !== currentVersion) { // <-- Используем localStorage
    notification.classList.add('show');
  }

  closeButton.addEventListener('click', function() {
    notification.classList.remove('show');
    notification.classList.add('hide');

    localStorage.setItem('updateVersion', currentVersion); // <-- Сохраняем текущую версию
    setTimeout(() => {
      notification.style.display = 'none';
    }, 300);
  });

  // Принудительное закрытие при первой загрузке, если версия уже совпадает
  if (localStorage.getItem('updateVersion') === currentVersion) {
    notification.style.display = 'none';
  }
});

// --------------------------------------------------------------------------------0000000000000000000000000000000000000-----------------------------------------------------
    // Скрипт обновления сайта при загрузке браузера
    document.addEventListener("DOMContentLoaded", function() {
      if (localStorage.getItem('reloaded') == null) {
        localStorage.setItem('reloaded', 'yes');
        location.reload();
      } else {
        localStorage.removeItem('reloaded');
      }
    }); 
