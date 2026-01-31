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
  const dataRef = database.ref(section); 
  const itemsContainer = document.getElementById(elementId);

  dataRef.on('value', (snapshot) => {
    itemsContainer.innerHTML = ''; // Очистить контейнер

    snapshot.forEach((childSnapshot) => {
      const itemText = childSnapshot.val().text;

      // 1. Создаем внешний враппер (для фильтра drop-shadow)
      const wrapper = document.createElement('div');
      wrapper.classList.add('item-wrapper');

      // 2. Создаем основной элемент (рамка и clip-path)
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('item');

      // 3. Создаем внутренний блок с текстом
      const itemTextDiv = document.createElement('div');
      itemTextDiv.classList.add('item-text');
      itemTextDiv.textContent = itemText;

      // Собираем структуру: wrapper -> item -> item-text
      itemDiv.appendChild(itemTextDiv);
      wrapper.appendChild(itemDiv);
      
      // Добавляем всю конструкцию в контейнер
      itemsContainer.appendChild(wrapper);
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
  const root = document;

  root.addEventListener('click', async (e) => {
    try {
      const sel = (window.getSelection && window.getSelection().toString()) || '';
      if (sel && sel.trim().length > 0) return;

      const item = e.target.closest('.item-wrapper');
      if (!item) return;

      // Защита от повторного клика во время анимации
      if (item.classList.contains('highlight')) return;

      const textElem = item.querySelector('.item-text');
      
      // 4) Находим текст для копирования
      let textToCopy = item.dataset.copy || '';
      if (!textToCopy && textElem) {
        textToCopy = (textElem.innerText || textElem.textContent || '').trim();
      }
      if (!textToCopy) return;

      // 5) Копируем
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        copyFallback(textToCopy);
      }

      // 6) ВИЗУАЛЬНАЯ ОБРАТНАЯ СВЯЗЬ (изменения здесь)
      if (textElem) {
        const originalText = textElem.innerText; 
        // 1. Берем точную высоту со всеми отступами
        const computedStyle = window.getComputedStyle(textElem);
        const currentHeight = computedStyle.height;

        // 2. Фиксируем высоту ЧЕРЕЗ minHeight и height одновременно
        textElem.style.height = currentHeight;
        textElem.style.minHeight = currentHeight;

        textElem.innerText = 'Скопировано';      
        item.classList.add('highlight');        

        setTimeout(() => {
          item.classList.remove('highlight');   
          textElem.innerText = originalText;  
          // 3. Сбрасываем фиксацию после возврата текста
          textElem.style.height = ''; 
          textElem.style.minHeight = '';
        }, 2000);
      }

    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  });

  function copyFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
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
document.addEventListener('DOMContentLoaded', () => {

    // === ВАШИ ИЗНАЧАЛЬНЫЕ ПЕРЕМЕННЫЕ И ЭЛЕМЕНТЫ ===
    const tutorialOverlay = document.getElementById('tutorial-overlay');
    const tutorialBox = document.getElementById('tutorial-box');
    const tutorialText = document.getElementById('tutorial-text');
    const tutorialPrevBtn = document.getElementById('tutorial-prev-btn');
    const tutorialNextBtn = document.getElementById('tutorial-next-btn');
    const tutorialCloseBtn = document.getElementById('tutorial-close-btn');
    const tutorialStepCounter = document.getElementById('tutorial-step-counter');
    const startTutorialBtn = document.getElementById('start-tutorial-btn');

    let currentStepIndex = 0;
    let highlightedElement = null;

    // === ВАШИ ИЗНАЧАЛЬНЫЕ tutorialSteps ===
    const tutorialSteps = [
        { selector: '#helper2', text: 'Добро пожаловать на сайт Таблица ППО. Это инструкция по всем таблицам и её особенностям созданная для того, чтобы вы знали все нюансы и могли использовать таблицу с полным комфортом. Если вы не видите элемента, на котором сфокусировано внимание шага инструкции, то просто листайте страницу вниз. Клавиши Далее и Назад вам в помощь, если захотите закончить, то просто крестик вверху справа. Приятного просмотра!', position: 'bottom' }, // 1
        { selector: '.link-wrapper.left-linkk .image-link', text: 'Это ссылка на мой Discord-сервер. Здесь вы можете получить поддержку и задать любые интересующие вас вопросы, а также предложить улучшения или исправления.', position: 'right' }, // 2
        { selector: '.link-wrapper.left-link .image-link', text: 'Этот значок ведет к приложению, которое такое же как эта таблица, только в приложении. Дополнительные функции биндер на открывание закрывание приложения и окно приложения находится поверх всех других окон.', position: 'right' }, // 3
        { selector: '#toggleControlsButton', text: 'Нажмите сюда, чтобы открыть настройки бинда для приложения. Это позволит вам настроить горячую клавишу для открывания/закрывания приложения. P.S. Работает только в приложении.', position: 'left' }, // 4
        { selector: '#themeToggle', text: 'Это кнопка выбора темы, при нажатии на неё у вас появится несколько кнопок, наведитесь на любую из них и вы увидите название темы. Подберите для себя наиболее удобную.', position: 'left' }, // 5
        { selector: '.container57', text: 'При наведении на название таблицы, вам на выбор показывается несколько таблиц, посмотрите и выберите для вас наиболее удобную.', position: 'bottom', requiredTable: 'table1' }, // 6
        { selector: '#legend-section', text: 'Это вкладка "Обозначения", она будет во всех таблицах в самом верху. Здесь собраны различные наименования, сокращения и прочее, что поможет вам в редактировании объявлений. Далее идут вкладки под каждую категорию, там сами посмотрите и всё поймете. Каждая вкладка сворачивается при нажатии на неё. В Таблица ППО и Таблица ППО 2.0 вы либо сами листаете таблицу и ищете нужные вам значения, либо по поиску, который имеет браузер F3. Ячейки копируются при нажатии на них, сопровождая копирование подсвечиванием ячейки, если вам нужно выделить конкретную часть, то делаете это и при этом все содержимое не будет скопировано. При каждом вашем открывании сайта данные обновляются и все значимые изменения я прописываю в уведомлении, которое так же появится при обновлении сайта или же при новом запуске браузера.', position: 'bottom', requiredTable: 'table1' }, // 7

        // 8-й пункт — должен быть в table2
        { selector: '#helper2', text: 'Это Таблица ППО 2.0, здесь все тоже самое, что и в первой таблице, но с двумя отличиями, после слова "Бюджет:" пишется "1.000.000 рублей. Свободный.", а после "Цена:" пишется "1.000.000 рублей. Договорная. Возможен торг. Возможен обмен." и комплектации тюнинга.', position: 'top', requiredTable: 'table2' }, // 8

        // 9 и 10 — в table3
        { selector: '#search-input-1', text: 'Это Поиск ППО, тут вся информация представлена сплошным списком ячеек, которые можно копировать нажатием на них. Тут находится строка поиска, куда необходимо ввести искомое значение. Результаты поиска отображаются в виде списка.', position: 'top', requiredTable: 'table3' }, // 9
        { selector: '.draft-area', text: 'Здесь, справа от поиска, имеется черновик, куда можно вписывать и редактировать найденные значения.', position: 'top', requiredTable: 'table3' }, // 10

        // 11 — в table4
        { selector: '#container2', text: 'Поиск ППО 2.0, тут функциональность аналогична предыдущему разделу, но с двумя отличиями, после слова "Бюджет:" пишется "1.000.000 рублей. Свободный.", а после "Цена:" пишется "1.000.000 рублей. Договорная. Возможен торг. Возможен обмен." и комплектации тюнинга.', position: 'top', requiredTable: 'table4' }, // 11

        // 12 и далее — в table5
        { selector: '#helper5', text: 'Выбор ППО - Этот раздел предназначен для выбора нужных параметров с помощью колонок. В колонках "Значение:" и "Значение с тюнингом:" есть поле поиска внутри этих колонок, аналогично поиску ппо, только вам нужно нажать (Выберите) и там у вас отобразится список подходящих по поиску значений.', position: 'top', requiredTable: 'table5' }, // 12
        { selector: '#itemmm', text: 'В колонке "Значение с тюнингом:" отображаются только машины, требующие указания тюнинга. Важно отметить, что в конце этих значений отсутствует точка, чтобы вы в колонке "Тюнинг" выбрали тюнинг на машину и уже там будет в конце точка.', position: 'bottom', requiredTable: 'table5' }, // 13
        { selector: '#itemm', text: 'В колонке "Значение:" представлены все доступные значения: квартиры, бизнесы, машины и т.д.', position: 'bottom', requiredTable: 'table5' }, // 14
        { selector: '#price', text: 'Во вкладке "Бюджет/Цена:" есть значение "Введите сумму", при нажатии у вас появится поле ввода и кнопка "готово", вводите сумму допустим 13250 и нажимаете готово и в результате у вас отобразится как надо "13.250 рублей.", но эту функцию надо использовать в последнюю очередь, так как после выбора суммы, если выбрать еще что-нибудь в любой из колонок, то сумма слетит и вам надо будет её вводить заново, либо же вы ввели сумму нужную вам и выбрали значения в остальных колонках и потом только нажимаете готово.', position: 'bottom', requiredTable: 'table5' }, // 15
        { selector: '#result', text: 'Ниже всех колонок есть две секции: Верхняя секция - отображает результат выбора параметров в колонках. Вы можете выбирать параметры и сразу видеть результат.', position: 'top', requiredTable: 'table5' }, // 16
        { selector: '#draft-area-5', text: 'Нижняя секция - это черновик работает по тому же принципу, что и в Поиск ППО, позволяя редактировать выбранные значения.', position: 'top', requiredTable: 'table5' }, // 17
        { selector: '.sww-button', text: 'Между этими секциями расположены кнопка "Копировать", чтобы скопировать результат в верхней секции и кнопка "Стереть", чтобы стереть все выбранные значения в колонках.', position: 'top', requiredTable: 'table5' }, // 18
        { selector: '#update-notification', text: 'На этом всё, если возникнут какие-либо вопросы и всякое всякое, то пишите в дискорд, там есть канал поддержка в форме тикета. Приятного пользования!', position: 'bottom', requiredTable: 'table5' } // 19
    ];

    // === ВАШИ ИЗНАЧАЛЬНЫЕ ФУНКЦИИ (findElementForStep, ensureTourMark, removeHighlight, positionTutorialBox, startTutorial, nextStep, prevStep, closeTutorial, resize handler) ===
    // Скопируйте их сюда, пожалуйста, если они у вас есть.
    // Пример, как должна выглядеть одна из них (но все должны быть в этом блоке):

    function findElementForStep(step) {
        if (typeof step.getElement === 'function') {
            try {
                const el = step.getElement();
                if (el instanceof Element) return el;
            } catch (e) {
                console.warn('Ошибка в getElement():', e);
            }
        }
        if (typeof step.selector === 'string') {
            const idxMatch = step.selector.match(/^(.*)::(\d+)$/);
            if (idxMatch) {
                const sel = idxMatch[1].trim();
                const idx = parseInt(idxMatch[2], 10);
                const nodeList = document.querySelectorAll(sel);
                return nodeList[idx] || null;
            }
            let el = document.querySelector(step.selector);
            if (el) return el;
            if (step.index !== undefined && Number.isInteger(step.index)) {
                const nl = document.querySelectorAll(step.selector);
                return nl[step.index] || null;
            }
            const nl = document.querySelectorAll(step.selector);
            if (nl.length) return nl[0];
        }
        if (step.textContains) {
            const text = step.textContains.toLowerCase();
            const scope = step.searchWithinSelector ? document.querySelectorAll(step.searchWithinSelector) : [document.body];
            for (const root of scope) {
                const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
                let node;
                while (node = walker.nextNode()) {
                    if (node.textContent && node.textContent.toLowerCase().includes(text)) {
                        return node;
                    }
                }
            }
        }
        return null;
    }

    function ensureTourMark(el, stepIndex) {
        if (!el) return null;
        if (!el.dataset.tourStep) {
            el.dataset.tourStep = 'step-' + (stepIndex + 1);
        }
        return el;
    }

    function removeHighlight() {
        if (highlightedElement) {
            highlightedElement.classList.remove('pulsing');
            highlightedElement.classList.remove('tutorial-highlighted');
            highlightedElement = null;
        }
    }

    function positionTutorialBox(targetElement, boxElement, position = 'bottom') {
        // --- Начинаем с фикса для позиционирования ---
        const computed = window.getComputedStyle(boxElement);
        const wasHidden = computed.display === 'none';

        if (wasHidden) {
            boxElement.style.visibility = 'hidden'; // Делаем невидимым, но измеряемым
            boxElement.style.display = 'block';
        }
        // --- Конец фикса ---

        const targetRect = targetElement.getBoundingClientRect();
        const boxRect = boxElement.getBoundingClientRect();
        const padding = 15;

        let top, left;

        switch (position) {
            case 'top':
                top = targetRect.top - boxRect.height - padding;
                left = targetRect.left + (targetRect.width - boxRect.width) / 2;
                break;
            case 'left':
                top = targetRect.top + (targetRect.height - boxRect.height) / 2;
                left = targetRect.left - boxRect.width - padding;
                break;
            case 'right':
                top = targetRect.top + (targetRect.height - boxRect.height) / 2;
                left = targetRect.right + padding;
                break;
            case 'bottom':
            default:
                top = targetRect.bottom + padding;
                left = targetRect.left + (targetRect.width - boxRect.width) / 2;
                break;
        }

        const margin = 10;
        top = Math.max(margin, top);
        left = Math.max(margin, left);
        if (top + boxRect.height > window.innerHeight - margin) {
            top = window.innerHeight - boxRect.height - margin;
        }
        if (left + boxRect.width > window.innerWidth - margin) {
            left = window.innerWidth - boxRect.width - margin;
        }

        boxElement.style.top = `${top}px`;
        boxElement.style.left = `${left}px`;

        // --- Восстанавливаем состояние, если блок был скрыт ---
        if (wasHidden) {
            boxElement.style.display = 'none';
            boxElement.style.visibility = '';
        }
        // --- Конец восстановления ---
    }

    function startTutorial() {
        currentStepIndex = 0;
        showStep(0);
    }

    function nextStep() {
        if (currentStepIndex < tutorialSteps.length - 1) {
            showStep(currentStepIndex + 1);
        }
    }

    function prevStep() {
        if (currentStepIndex > 0) {
            showStep(currentStepIndex - 1);
        }
    }

    function closeTutorial() {
        removeHighlight();
        tutorialOverlay.style.opacity = '0';
        tutorialBox.style.opacity = '0';
        tutorialBox.style.transform = 'translateY(20px)';

        setTimeout(() => {
            tutorialOverlay.style.display = 'none';
            tutorialBox.style.display = 'none';
        }, 300);
    }

    // --- Утилиты для переключения таблиц и ожидания видимости (ИСПРАВЛЕННЫЕ) ---
    function getCurrentVisibleTableId() {
        // Проверяем, что .table-section существуют, прежде чем искать .hidden
        const visible = document.querySelector('.table-section:not(.hidden)');
        return visible ? visible.id : null;
    }

    function clickDropdownTableLink(tableId) {
        // Исправлена синтаксическая ошибка: добавлены кавычки вокруг строки селектора
        const anchor = document.querySelector(`.dropdown-content a[data-table="${tableId}"]`);
        if (anchor) {
            anchor.click();
            return true;
        }
        return false;
    }

    // Ваша оригинальная showTable из HTML-части.
    // Она будет вызвана через clickDropdownTableLink.
    // Добавьте localStorage.setItem туда, если это не сделано.
    function showTable(selectedTableId) {
        const tableSections = document.querySelectorAll('.table-section'); // Инициализируем здесь, чтобы было в замыкании
        tableSections.forEach(tableSection => {
            tableSection.classList.add('hidden');
        });
        const selectedTable = document.getElementById(selectedTableId);
        if (selectedTable) {
            selectedTable.classList.remove('hidden');
            localStorage.setItem('lastSelectedTableId', selectedTableId); // Убедитесь, что это сохраняется
        }
    }

    function directShowTableFallback(tableId) {
        const all = document.querySelectorAll('.table-section');
        all.forEach(s => s.classList.add('hidden'));
        const target = document.getElementById(tableId);
        if (target) {
            target.classList.remove('hidden');
            localStorage.setItem('lastSelectedTableId', tableId); // Важно сохранять состояние
        } else {
            console.warn('Fallback: Table section not found by ID:', tableId);
        }
    }

    function waitForTableVisible(tableId, timeout = 3500) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            const check = () => {
                if (getCurrentVisibleTableId() === tableId) {
                    resolve();
                    return;
                }
                if (Date.now() - start >= timeout) {
                    reject(new Error('Timeout waiting for table ' + tableId));
                    return;
                }
                requestAnimationFrame(check);
            };
            check();
        });
    }

    function transitionToTable(tableId) {
        const clicked = clickDropdownTableLink(tableId);
        if (!clicked) {
            directShowTableFallback(tableId);
        }
        return waitForTableVisible(tableId).catch(err => {
            console.warn('transitionToTable: ожидание завершилось с ошибкой:', err);
            directShowTableFallback(tableId);
            return new Promise(res => setTimeout(res, 250));
        });
    }

    // --- ОБНОВЛЁННАЯ АСИНХРОННАЯ ФУНКЦИЯ showStep ---
    async function showStep(index) {
        if (index < 0 || index >= tutorialSteps.length) return;

        removeHighlight();
        currentStepIndex = index;
        const step = tutorialSteps[currentStepIndex];

        // Если шаг требует конкретной таблицы — проверяем и при необходимости переключаем
        if (step.requiredTable) {
            const cur = getCurrentVisibleTableId();
            if (cur !== step.requiredTable) {
                try {
                    await transitionToTable(step.requiredTable);
                } catch (e) {
                    console.warn('Не удалось переключиться на таблицу', step.requiredTable, e);
                }
            }
        }

        const elementToHighlight = findElementForStep(step);

        if (!elementToHighlight) {
            console.warn(`Элемент для шага ${index+1} не найден (селектор/поиск):`, step);
            if (currentStepIndex < tutorialSteps.length - 1) {
                showStep(currentStepIndex + 1);
            } else {
                closeTutorial();
            }
            return;
        }

        highlightedElement = ensureTourMark(elementToHighlight, index);
        highlightedElement.classList.add('tutorial-highlighted', 'pulsing');

        tutorialText.textContent = step.text || '';
        tutorialStepCounter.textContent = `${currentStepIndex + 1}/${tutorialSteps.length}`;

        const position = step.position || 'bottom';
        // --- Вызов позиционирования после показа и перед анимацией ---
        positionTutorialBox(highlightedElement, tutorialBox, position);

        tutorialPrevBtn.disabled = currentStepIndex === 0;
        tutorialNextBtn.disabled = currentStepIndex === tutorialSteps.length - 1;

        // Показываем оверлей и блок инструкций плавно
        tutorialOverlay.style.display = 'block';
        tutorialBox.style.display = 'block';
        setTimeout(() => { // Небольшая задержка для плавного появления
            tutorialOverlay.style.opacity = '1';
            tutorialBox.style.opacity = '1';
            tutorialBox.style.transform = 'translateY(0)';
        }, 10);
    }

    // --- ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ТУРА ---
    if (startTutorialBtn) {
        startTutorialBtn.addEventListener('click', startTutorial);
    }
    tutorialNextBtn.addEventListener('click', nextStep);
    tutorialPrevBtn.addEventListener('click', prevStep);
    tutorialCloseBtn.addEventListener('click', closeTutorial);

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && tutorialBox.style.display === 'block') {
            closeTutorial();
        }
    });

    window.addEventListener('resize', () => {
        if (tutorialBox.style.display === 'block' && highlightedElement) {
            positionTutorialBox(highlightedElement, tutorialBox, tutorialSteps[currentStepIndex].position || 'bottom');
        }
    });

    // --- ВАШ ОРИГИНАЛЬНЫЙ КОД ДЛЯ ПЕРЕКЛЮЧЕНИЯ ТАБЛИЦ (вставлен сюда) ---
    const dropdownContents = document.querySelectorAll('.dropdown-content');
    const tableSections = document.querySelectorAll('.table-section');
    const LAST_SELECTED_TABLE_KEY = 'lastSelectedTableId';

    // Ваша showTable должна быть здесь. Если она уже была объявлена выше,
    // удалите дубликат. Убедитесь, что она сохраняет в localStorage.
    // Если её нет, добавьте объявление showTable как в примере выше.
    // function showTable(selectedTableId) { ... } // Уже объявлена выше

    dropdownContents.forEach(dropdownContent => {
        dropdownContent.addEventListener('click', function(event) {
            if (event.target.tagName === 'A') {
                event.preventDefault();
                const selectedTableId = event.target.dataset.table;
                // Важно: здесь вызывает ВАШУ showTable, которая переключает видимость
                // и сохраняет состояние. transitionToTable делает клик, который
                // вызовет этот обработчик.
                showTable(selectedTableId); // Вызов вашей showTable
            }
        });
    });

    const storedTableId = localStorage.getItem(LAST_SELECTED_TABLE_KEY);

    if (storedTableId) {
        showTable(storedTableId); // Показываем сохраненную таблицу при загрузке
    } else {
        showTable('table1'); // Показываем table1 по умолчанию, если ничего не сохранено
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
    document.documentElement.classList.remove('light','pink','gta','NewYear'); // Меняем на document.documentElement
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
  const currentVersion = '1.1'; // <--  УКАЖИТЕ ТЕКУЩУЮ ВЕРСИЮ ОБНОВЛЕНИЯ

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
