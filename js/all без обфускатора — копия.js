// Глобальное хранилище самых свежих данных в оперативной памяти JS (для мгновенного рендера)
const dbInMemoryState = {};
const registeredTasks = [];
const activeFirebaseRefs = new Map();
const dataSnapshotsTracker = { loadData: "", loadCells: "" };

// --- СИСТЕМА ЛОКАЛЬНОГО КЭШИРОВАНИЯ ---
function getCachedData(key) {
  try {
    const cached = localStorage.getItem('cache_' + key);
    return cached ? JSON.parse(cached) : null;
  } catch (e) { return null; }
}
function setCachedData(key, data) {
  try { localStorage.setItem('cache_' + key, JSON.stringify(data)); } catch (e) {}
}

// 2. ДВИЖОК МГНОВЕННОЙ ФОНОВОЙ СИНХРОНИЗАЦИИ
function registerAndLoad(tableId, type, section, elementId) {
  const exists = registeredTasks.some(t => t.section === section && t.elementId === elementId);
  if (!exists) {
    registeredTasks.push({ tableId, type, section, elementId });
  }

  // 1. Сначала мгновенно выводим кэш из localStorage
  const container = document.getElementById(elementId);
  if (container) {
    const cached = getCachedData(section);
    if (cached) {
      dbInMemoryState[section] = cached; // Записываем в память
      if (type === 'data') renderDataItems(cached, container);
      else if (type === 'cells') renderCells(cached, container);
    } else {
      container.innerHTML = '<div class="loading-skeleton">Загрузка...</div>';
    }
  }

// 2. СРАЗУ запускаем фоновое live-соединение для этой секции (независимо от того, скрыта таблица или нет)
  startLiveListener(type, section, elementId);
}

function startLiveListener(type, section, elementId) {
  if (activeFirebaseRefs.has(section)) return; // Уже слушаем эту ветку

  const dataRef = database.ref(section);
  activeFirebaseRefs.set(section, dataRef);

  dataRef.on('value', (snapshot) => {
    let freshData = null;

    if (type === 'data') {
      const itemsArray = [];
      snapshot.forEach((childSnapshot) => {
        const val = childSnapshot.val();
        if (val && val.text) itemsArray.push({ text: val.text });
      });
      freshData = itemsArray;
    } 
    else if (type === 'cells') {
      if (snapshot.exists()) {
        const cellsArray = [];
        snapshot.forEach((childSnapshot) => {
          const itemData = childSnapshot.val();
          if (itemData && itemData.text) cellsArray.push({ text: itemData.text });
        });
        freshData = cellsArray;
      }
    }

    if (!freshData) return;

    // Сохраняем свежие данные в память ЖС и кэш браузера
    dbInMemoryState[section] = freshData;
    setCachedData(section, freshData);

    // ВАЖНО: Отрисовываем в HTML только если таблица физически видна пользователю прямо сейчас!
    const parentTableId = getCurrentPageTableId(elementId);
    const activeTableId = localStorage.getItem(LAST_SELECTED_TABLE_KEY) || 'table1';

    if (parentTableId === activeTableId) {
      const container = document.getElementById(elementId);
      if (container) {
        if (type === 'data') renderDataItems(freshData, container);
        else if (type === 'cells') renderCells(freshData, container);
      }
    }
  });
}

// Заглушки вызовов для HTML
function loadData(section, elementId) {
  const tableId = getCurrentPageTableId(elementId);
  registerAndLoad(tableId, 'data', section, elementId);
}

function loadCellsFromFirebase(section, targetContainerId) {
  const tableId = getCurrentPageTableId(targetContainerId);
  registerAndLoad(tableId, 'cells', section, targetContainerId);
}

function loadOptionsFromFirebase(section, selectElementId) {
  const dataRef = database.ref(section);
  const selectElement = document.getElementById(selectElementId);
  if (!selectElement) return;

  if (!selectElement.dataset.initialSaved) {
    const initialOptions = Array.from(selectElement.options).map(opt => ({ value: opt.value, text: opt.text }));
    selectElement.dataset.initialOptions = JSON.stringify(initialOptions);
    selectElement.dataset.initialSaved = "true";
  }
  const initialOptions = JSON.parse(selectElement.dataset.initialOptions || "[]");

  dataRef.on('value', (snapshot) => {
    const fragment = document.createDocumentFragment();
    const addedValues = new Set();

    initialOptions.forEach(opt => {
      if (!addedValues.has(opt.value)) {
        const optionNode = document.createElement('option');
        optionNode.value = opt.value;
        optionNode.text = opt.text;
        fragment.appendChild(optionNode);
        addedValues.add(opt.value);
      }
    });

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const itemData = childSnapshot.val();
        const optionValue = itemData.value || itemData.text;
        const optionText = itemData.text;
        if (optionText && !addedValues.has(optionValue)) {
          const optionNode = document.createElement('option');
          optionNode.value = optionValue;
          optionNode.text = optionText;
          fragment.appendChild(optionNode);
          addedValues.add(optionValue);
        }
      });
    }
    selectElement.innerHTML = '';
    selectElement.appendChild(fragment);
  });
}

// 3. МАКСИМАЛЬНО БЫСТРЫЕ РЕНДЕРЕРЫ DOM
function renderDataItems(items, container) {
  container.innerHTML = ''; 
  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'item-wrapper';
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    const itemTextDiv = document.createElement('div');
    itemTextDiv.className = 'item-text';
    itemTextDiv.textContent = item.text;

    itemDiv.appendChild(itemTextDiv);
    wrapper.appendChild(itemDiv);
    fragment.appendChild(wrapper);
  });
  container.appendChild(fragment);
  triggerActiveSearch();
}

function renderCells(cells, container) {
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  cells.forEach((cellData) => {
    const cellWrapper = document.createElement('div');
    cellWrapper.className = 'cell-wrapper';
    cellWrapper.dataset.copy = cellData.text;
    const cellDiv = document.createElement('div');
    cellDiv.className = 'cell';
    const cellTextDiv = document.createElement('div');
    cellTextDiv.className = 'cell-text';
    cellTextDiv.textContent = cellData.text;

    cellDiv.appendChild(cellTextDiv);
    cellWrapper.appendChild(cellDiv);
    fragment.appendChild(cellWrapper);
  });
  container.appendChild(fragment);
  triggerActiveSearch();
}

function triggerActiveSearch() {
  const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"], .search-input');
  searchInputs.forEach(input => {
    if (input.value && input.value.trim() !== '') {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('keyup', { bubbles: true }));
    }
  });
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

// Ключ для хранения выбранной таблицы в localStorage
const LAST_SELECTED_TABLE_KEY = 'lastSelectedTableId';

// Определяет, на какой странице (таблице) мы находимся прямо сейчас по URL
function getCurrentPageTableId() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/table-ppo-2/')) return 'table2';
  if (path.includes('/search-ppo-2/')) return 'table4'; // Проверяем "2" сначала
  if (path.includes('/search-ppo/')) return 'table3';
  if (path.includes('/choice-ppo/')) return 'table5';
  return 'table1'; // Если папок в пути нет — мы в корне (на главной)
}

// Вычисляет правильный относительный путь для перехода на другую таблицу
function getRedirectUrl(targetTableId) {
  const isHome = getCurrentPageTableId() === 'table1';
  const prefix = isHome ? './' : '../';
  
  let relativePath = '';

  switch (targetTableId) {
    case 'table1': relativePath = (isHome ? './' : '../') + 'index.html';
      break;
    case 'table2': relativePath = prefix + 'table-ppo-2/index.html'; 
      break;
    case 'table3': relativePath = prefix + 'search-ppo/index.html';
      break;
    case 'table4': relativePath = prefix + 'search-ppo-2/index.html';
      break;
    case 'table5': relativePath = prefix + 'choice-ppo/index.html';
      break;
    default: relativePath = prefix + 'index.html';
  }

  // Встроенный в браузер конвертер: превращает относительный путь в полный абсолютный URL
  return new URL(relativePath, window.location.href).href;
}

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Функция стрелки и открытия на секции "Обозначения" во всех таблицах
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
// Функция стрелки и открытия для всех секций в таблице ппо и 2.0 и в выбор ппо секция обозначения
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
// Функция копирования ячеек во всех таблицах и поисках
document.addEventListener('click', async (e) => {
  const selection = (window.getSelection && window.getSelection().toString()) || '';
  if (selection && selection.trim().length > 0) return;

  const wrapper = e.target.closest('.cell-wrapper, .item-wrapper');
  if (!wrapper) return;
  if (wrapper.classList.contains('highlight')) return;

  const isCell = wrapper.classList.contains('cell-wrapper');

  if (isCell) {
    const targetContainerIds = ['container1', 'container2'];
    let isInTargetContainer = false;
    for (const containerId of targetContainerIds) {
      const container = document.getElementById(containerId);
      if (container && container.contains(wrapper)) {
        isInTargetContainer = true;
        break;
      }
    }
    if (!isInTargetContainer) return;
  }

  const textElem = wrapper.querySelector('.cell-text, .item-text');
  if (!textElem) return;

  let textToCopy = wrapper.dataset.copy || (textElem.innerText || textElem.textContent || '').trim();
  if (!textToCopy) return;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    const originalText = textElem.innerText;
    const computedStyle = window.getComputedStyle(textElem);
    const currentHeight = computedStyle.height;
    textElem.style.height = currentHeight;
    textElem.style.minHeight = currentHeight;
    
    wrapper.classList.add('highlight');
    textElem.innerText = 'Скопировано';

    const resetDelay = isCell ? 1500 : 2000;

    setTimeout(() => {
      wrapper.classList.remove('highlight');
      textElem.innerText = originalText;
      textElem.style.height = '';
      textElem.style.minHeight = '';
    }, resetDelay);

  } catch (err) {
    console.error('Не удалось скопировать текст:', err);
  }
});

document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    if (container.classList && container.classList.contains('container')) {
      selection.removeAllRanges(); 
    }
    
    const startCard = range.startContainer.parentElement.closest('.item-text, .cell-text');
    const endCard = range.endContainer.parentElement.closest('.item-text, .cell-text');
    
    if (startCard !== endCard) {
      selection.removeAllRanges(); 
    }
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Функция биндера для приложения
document.addEventListener('DOMContentLoaded', () => {
    const toggleControlsButton = document.getElementById('toggleControlsButton');
    const controlsContainer = document.getElementById('controlsContainer');
    const setShortcutButton = document.getElementById('setShortcutButton');
    const clearShortcutButton = document.getElementById('clearShortcutButton');
    const shortcutInput = document.getElementById('shortcutInput');
    const currentShortcutElement = document.getElementById('currentShortcut');

    let keys = [];
    const defaultInputValue = "Введите бинд...";

    function isApiReady() {
      return typeof window.api !== 'undefined' && typeof window.api.setShortcut === 'function';
    }

    function setShortcut(newShortcut) {
      if (isApiReady()) {
        window.api.setShortcut(newShortcut);
      } else {
        console.error('window.api или window.api.setShortcut не определены.');
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
        // console.warn('window.api не доступен при загрузке страницы. Обработчик onShortcutChanged не установлен.');
    }
  });

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Функция инструкции
    let currentStepIndex = 0;
    let highlightedElement = null;

    // === ВАШИ ИЗНАЧАЛЬНЫЕ tutorialSteps ===
    const tutorialSteps = [
        { selector: '#legend-header', text: 'Добро пожаловать на сайт Таблица ППО. Это инструкция по всем таблицам и её особенностям созданная для того, чтобы вы знали все нюансы и могли использовать таблицу с полным комфортом. Если вы не видите элемента, на котором сфокусировано внимание шага инструкции, то просто листайте страницу вниз. Клавиши Далее и Назад вам в помощь, если захотите закончить, то просто крестик вверху справа. Приятного просмотра!', position: 'bottom' }, // 1
        { selector: '.link-wrapper.left-linkk .image-link', text: 'Это ссылка на мой Discord-сервер. Здесь вы можете получить поддержку и задать любые интересующие вас вопросы, а также предложить улучшения или исправления.', position: 'right' }, // 2
        { selector: '.link-wrapper.left-link .image-link', text: 'Этот значок ведет к приложению, которое такое же как эта таблица, только в приложении. Дополнительные функции биндер на открывание закрывание приложения и окно приложения находится поверх всех других окон.', position: 'right' }, // 3
        { selector: '#toggleControlsButton', text: 'Нажмите сюда, чтобы открыть настройки бинда для приложения. Это позволит вам настроить горячую клавишу для открывания/закрывания приложения. P.S. Работает только в приложении.', position: 'left' }, // 4
        { selector: '#themeToggle', text: 'Это кнопка выбора темы, при нажатии на неё у вас появится несколько кнопок, наведитесь на любую из них и вы увидите название темы. Подберите для себя наиболее удобную.', position: 'left' }, // 5
        { selector: '.container57', text: 'При наведении на название таблицы, вам на выбор показывается несколько таблиц, посмотрите и выберите для вас наиболее удобную.', position: 'bottom' }, // 6
        { selector: '#legend-section', text: 'Это вкладка "Обозначения", она будет во всех таблицах в самом верху. Здесь собраны различные наименования, сокращения и прочее, что поможет вам в редактировании объявлений.', position: 'center', scrollBlock: 'top' }, // 7
        
        // 8-й пункт в Таблица ППО table1
        { selector: '#helper', text: 'Далее идут вкладки под каждую категорию, там сами посмотрите и всё поймете. Каждая вкладка сворачивается при нажатии на неё. В Таблица ППО и Таблица ППО 2.0 вы либо сами листаете таблицу и ищете нужные вам значения, либо по поиску, который имеет браузер F3. Ячейки копируются при нажатии на них, сопровождая копирование подсвечиванием ячейки, если вам нужно выделить конкретную часть, то делаете это и при этом все содержимое не будет скопировано. При каждом вашем открывании сайта данные обновляются и все значимые изменения я прописываю в уведомлении, которое так же появится при обновлении сайта или же при новом запуске браузера.', position: 'top', requiredTable: 'table1', scrollBlock: 'start', scrollOffset: 550 }, // 8

        // 9-й пункт — должен быть в table2
        { selector: '#helper2', text: 'Это Таблица ППО 2.0, здесь все тоже самое, что и в первой таблице, но с двумя отличиями, после слова "Бюджет:" пишется "1.000.000 рублей. Свободный.", а после "Цена:" пишется "1.000.000 рублей. Договорная. Возможен торг. Возможен обмен." и комплектации тюнинга. Создана она для того, чтобы вы стирали не нужные значения и сотавляли нужные, чтобы не прописывать их самим.', position: 'top', requiredTable: 'table2', scrollBlock: 'start', scrollOffset: 400 }, // 9

        // 10 и 11 — в table3
        { selector: '#search-input-1', text: 'Это Поиск ППО, тут вся информация представлена сплошным списком ячеек, которые можно копировать нажатием на них. Тут находится строка поиска, куда необходимо ввести искомое значение. Результаты поиска отображаются в виде списка. Стереть поиск можно нажатием на клавишу Escape (ESC).', position: 'top', requiredTable: 'table3' }, // 10
        { selector: '.draft-area', text: 'Здесь, справа от поиска, имеется черновик, куда можно вписывать и редактировать найденные значения.', position: 'top', requiredTable: 'table3' }, // 11

        // 12 — в table4
        { selector: '#container2', text: 'Поиск ППО 2.0, тут функциональность аналогична предыдущему разделу, но с двумя отличиями, после слова "Бюджет:" пишется "1.000.000 рублей. Свободный.", а после "Цена:" пишется "1.000.000 рублей. Договорная. Возможен торг. Возможен обмен." и комплектации тюнинга.', position: 'top', requiredTable: 'table4', scrollBlock: 'start', scrollOffset: 400 }, // 12

        // 13 и далее — в table5
        { selector: '#helper5', text: 'Выбор ППО - Этот раздел предназначен для выбора нужных параметров с помощью колонок. В колонках "Значение:" и "Значение с тюнингом:" есть поле поиска внутри этих колонок, аналогично поиску ппо, только вам нужно нажать (Выберите) и там у вас отобразится список подходящих по поиску значений.', position: 'top', requiredTable: 'table5', scrollBlock: 'start', scrollOffset: 400 }, // 13
        { selector: '#itemmm', text: 'В колонке "Значение с тюнингом:" отображаются только машины, требующие указания тюнинга. Важно отметить, что в конце этих значений отсутствует точка, чтобы вы в колонке "Тюнинг" выбрали тюнинг на машину и уже там будет в конце точка.', position: 'bottom', requiredTable: 'table5' }, // 14
        { selector: '#itemm', text: 'В колонке "Значение:" представлены все доступные значения: квартиры, бизнесы, машины и т.д.', position: 'bottom', requiredTable: 'table5' }, // 15
        { selector: '#price', text: 'Во вкладке "Бюджет/Цена:" есть значение "Введите сумму", при нажатии у вас появится поле ввода и кнопка "готово", вводите сумму допустим 13250 и нажимаете готово и в результате у вас отобразится как надо "13.250 рублей.", но эту функцию надо использовать в последнюю очередь, так как после выбора суммы, если выбрать еще что-нибудь в любой из колонок, то сумма слетит и вам надо будет её вводить заново, либо же вы ввели сумму нужную вам и выбрали значения в остальных колонках и потом только нажимаете готово.', position: 'bottom', requiredTable: 'table5' }, // 16
        { selector: '#result', text: 'Ниже всех колонок есть две секции: Верхняя секция - отображает результат выбора параметров в колонках. Вы можете выбирать параметры и сразу видеть результат.', position: 'top', requiredTable: 'table5' }, // 17
        { selector: '#draft-area-5', text: 'Нижняя секция - это черновик работает по тому же принципу, что и в Поиск ППО, позволяя редактировать выбранные значения.', position: 'top', requiredTable: 'table5' }, // 18
        { selector: '.sww-button', text: 'Между этими секциями расположены кнопка "Копировать", чтобы скопировать результат в верхней секции и кнопка "Стереть", чтобы стереть все выбранные значения в колонках.', position: 'top', requiredTable: 'table5' }, // 19
        { selector: '#update-notification', text: 'На этом всё, если возникнут какие-либо вопросы и всякое всякое, то пишите в дискорд, там есть канал поддержка в форме тикета. Приятного пользования!', position: 'bottom', requiredTable: 'table5' } // 20
    ];

// --- АВТО-ИНЖЕКТОР: Создает окно инструкции в HTML, если его нет на странице ---
function injectTutorialHTMLIfNeeded() {
  if (document.getElementById('tutorial-box')) return;

  const overlay = document.createElement('div');
  overlay.id = 'tutorial-overlay';
  overlay.style.display = 'none';
  document.body.appendChild(overlay);

  const box = document.createElement('div');
  box.id = 'tutorial-box';
  box.style.display = 'none';
  box.innerHTML = `
    <button id="tutorial-close-btn" class="tutorial-close-btn">×</button>
    <p id="tutorial-text"></p>
    <div class="tutorial-navigation">
        <button id="tutorial-prev-btn" class="tutorial-nav-btn" disabled>← Назад</button>
        <span id="tutorial-step-counter"></span>
        <button id="tutorial-next-btn" class="tutorial-nav-btn">Далее →</button>
    </div>
  `;
  document.body.appendChild(box);
}

// 3. Вспомогательные функции позиционирования и подсветки
function findElementForStep(step) {
  if (typeof step.selector === 'string') {
    const idxMatch = step.selector.match(/^(.*)::(\d+)$/);
    if (idxMatch) {
      const sel = idxMatch[1].trim();
      const idx = parseInt(idxMatch[2], 10);
      const nodeList = document.querySelectorAll(sel);
      return nodeList[idx] || null;
    }
    return document.querySelector(step.selector);
  }
  return null;
}

function ensureTourMark(el, stepIndex) {
  if (!el) return null;
  if (!el.dataset.tourStep) el.dataset.tourStep = 'step-' + (stepIndex + 1);
  return el;
}

function removeHighlight() {
  if (highlightedElement) {
    highlightedElement.classList.remove('pulsing', 'tutorial-highlighted');
    highlightedElement = null;
  }
}

function positionTutorialBox(targetElement, boxElement, position = 'bottom') {
  boxElement.style.position = 'absolute';
  const computed = window.getComputedStyle(boxElement);
  const wasHidden = computed.display === 'none';

  if (wasHidden) {
    boxElement.style.visibility = 'hidden';
    boxElement.style.display = 'block';
  }
  const originalTransform = boxElement.style.transform;
  boxElement.style.transform = 'none';
  const targetRect = targetElement.getBoundingClientRect();
  const boxRect = boxElement.getBoundingClientRect();
  const padding = 15;
  boxElement.style.transform = originalTransform;
  const targetDocTop = targetRect.top + window.scrollY;
  const targetDocLeft = targetRect.left + window.scrollX;
  let top, left;
  
  switch (position) {
    case 'center': 
      top = targetDocTop + (targetRect.height - boxRect.height) / 2;
      left = targetDocLeft + (targetRect.width - boxRect.width) / 2;
      break;
    case 'top':
      top = targetDocTop - boxRect.height - padding;
      left = targetDocLeft + (targetRect.width - boxRect.width) / 2;
      break;
    case 'left':
      top = targetDocTop + (targetRect.height - boxRect.height) / 2;
      left = targetDocLeft - boxRect.width - padding;
      break;
    case 'right':
      top = targetDocTop + (targetRect.height - boxRect.height) / 2;
      left = targetDocLeft + targetRect.width + padding;
      break;
    case 'bottom':
    default:
      top = targetDocTop + targetRect.height + padding;
      left = targetDocLeft + (targetRect.width - boxRect.width) / 2;
      break;
  }

  const margin = 10;
  top = Math.max(margin, top);
  left = Math.max(margin, left);
  
  const maxLeft = document.documentElement.scrollWidth - boxRect.width - margin;
  if (left > maxLeft) left = maxLeft;

  // Записываем точные пиксели на основе абсолютных координат документа
  boxElement.style.top = `${top}px`;
  boxElement.style.left = `${left}px`;

  if (wasHidden) {
    boxElement.style.display = 'none';
    boxElement.style.visibility = '';
  }
}

async function showStep(index) {
  if (index < 0 || index >= tutorialSteps.length) return;

  const step = tutorialSteps[index];
  const currentPageId = getCurrentPageTableId(); // Безопасный вызов роутера

  // ПЕРЕХОД НА ДРУГУЮ СТРАНИЦУ (ЧЕКПОИНТ)
  if (step.requiredTable && step.requiredTable !== currentPageId) {
    localStorage.setItem('tutorial_active', 'true');
    localStorage.setItem('tutorial_step', index.toString());
    localStorage.setItem(LAST_SELECTED_TABLE_KEY, step.requiredTable);

    window.location.href = getRedirectUrl(step.requiredTable);
    return; 
  }

  injectTutorialHTMLIfNeeded();

  removeHighlight();
  currentStepIndex = index;
  localStorage.setItem('tutorial_step', index.toString());

  const tutorialOverlay = document.getElementById('tutorial-overlay');
  const tutorialBox = document.getElementById('tutorial-box');
  const tutorialText = document.getElementById('tutorial-text');
  const tutorialPrevBtn = document.getElementById('tutorial-prev-btn');
  const tutorialNextBtn = document.getElementById('tutorial-next-btn');
  const tutorialStepCounter = document.getElementById('tutorial-step-counter');

  const elementToHighlight = findElementForStep(step);

  if (!elementToHighlight) {
    if (currentStepIndex < tutorialSteps.length - 1) {
      showStep(currentStepIndex + 1);
    } else {
      closeTutorial();
    }
    return;
  }

  highlightedElement = ensureTourMark(elementToHighlight, index);
  highlightedElement.classList.add('tutorial-highlighted', 'pulsing');
  highlightedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const scrollBlock = step.scrollBlock || 'center';
  if (scrollBlock === 'start') {
    const targetRect = highlightedElement.getBoundingClientRect();
    const targetDocTop = targetRect.top + window.scrollY;
    
    const offset = step.scrollOffset !== undefined ? step.scrollOffset : 130;
    
    window.scrollTo({
      top: Math.max(0, targetDocTop - offset),
      behavior: 'smooth'
    });
  } else {
    highlightedElement.scrollIntoView({ behavior: 'smooth', block: scrollBlock });
  }

  tutorialText.textContent = step.text || '';
  tutorialStepCounter.textContent = `${currentStepIndex + 1}/${tutorialSteps.length}`;

  positionTutorialBox(highlightedElement, tutorialBox, step.position || 'bottom');

  tutorialPrevBtn.disabled = currentStepIndex === 0;
  tutorialNextBtn.disabled = currentStepIndex === tutorialSteps.length - 1;

  tutorialOverlay.style.display = 'block';
  tutorialBox.style.display = 'block';
  setTimeout(() => {
    tutorialOverlay.style.opacity = '1';
    tutorialBox.style.opacity = '1';
    tutorialBox.style.transform = 'translateY(0)';
  }, 10);
}

function startTutorial() {
  localStorage.setItem('tutorial_active', 'true');
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
  localStorage.setItem('tutorial_active', 'false');
  localStorage.removeItem('tutorial_step');
  
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  const tutorialBox = document.getElementById('tutorial-box');

  if (tutorialOverlay && tutorialBox) {
    tutorialOverlay.style.opacity = '0';
    tutorialBox.style.opacity = '0';
    setTimeout(() => {
      tutorialOverlay.style.display = 'none';
      tutorialBox.style.display = 'none';
    }, 300);
  }
}

// ---------------------------------------------------------------------------------------------
// Функция выпадающего списка выбора таблиц, переключение между таблицами
document.addEventListener('DOMContentLoaded', () => {
  const dropdownContents = document.querySelectorAll('.dropdown-content');

  // УМНЫЙ ЗАПИСАТЕЛЬ КЛИКОВ (БЕЗ БЛОКИРОВКИ НАВИГАЦИИ!)
  dropdownContents.forEach(dropdownContent => {
    dropdownContent.addEventListener('click', function(event) {
      const anchor = event.target.closest('a');
      if (!anchor) return;

      // Получаем адрес из href ссылки (например: "../search-ppo/index.html")
      const href = anchor.getAttribute('href').toLowerCase();
      let targetTableId = 'table1';

      if (href.includes('table-ppo-2')) targetTableId = 'table2';
      else if (href.includes('search-ppo-2')) targetTableId = 'table4';
      else if (href.includes('search-ppo')) targetTableId = 'table3';
      else if (href.includes('choice-ppo')) targetTableId = 'table5';
      else if (href.includes('index.html')) targetTableId = 'table1';

      localStorage.setItem(LAST_SELECTED_TABLE_KEY, targetTableId);
    });
  });

  // --- ЛОГИКА УМНОГО АВТОРЕДИРЕКТА ПРИ СТАРТЕ ---
  const currentPage = getCurrentPageTableId(); 
  const lastSelected = localStorage.getItem(LAST_SELECTED_TABLE_KEY) || 'table1';

  if (currentPage === 'table1' && lastSelected !== 'table1') {
    const destination = getRedirectUrl(lastSelected);
    window.location.href = destination; 
    return; 
  } else if (lastSelected !== currentPage) {
    localStorage.setItem(LAST_SELECTED_TABLE_KEY, currentPage);
  }

  // Запуск инструкции по клику (через делегирование)
  document.addEventListener('click', (e) => {
    if (!e.target) return;

    if (e.target.id === 'start-tutorial-btn') {
      startTutorial(); 
    } else if (e.target.id === 'tutorial-next-btn') {
      nextStep();
    } else if (e.target.id === 'tutorial-prev-btn') {
      prevStep();
    } else if (e.target.id === 'tutorial-close-btn') {
      closeTutorial();
    }
  });

  // Горячие клавиши для закрытия (ESC)
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const box = document.getElementById('tutorial-box');
      if (box && box.style.display === 'block') {
        closeTutorial(); // Прямой вызов глобальной функции
      }
    }
  });

  // Пересчет позиции подсказки при изменении размера экрана
  window.addEventListener('resize', () => {
    const box = document.getElementById('tutorial-box');
    if (box && box.style.display === 'block' && highlightedElement) {
      positionTutorialBox(highlightedElement, box, tutorialSteps[currentStepIndex].position || 'bottom');
    }
  });

  // Авто-возобновление тура после перехода на другую страницу
  const isTutorialActive = localStorage.getItem('tutorial_active') === 'true';
  if (isTutorialActive) {
    injectTutorialHTMLIfNeeded(); // Прямой вызов глобальной функции
    const savedStep = parseInt(localStorage.getItem('tutorial_step') || '0', 10);
    setTimeout(() => {
      showStep(savedStep); // Прямой вызов глобальной функции
    }, 450);
  }
});

// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Функция открытия, закрытия, сохранения в кеше, выбора темы
document.addEventListener('DOMContentLoaded', () => {
  const arc = document.getElementById('themeArc');
  const toggle = document.getElementById('themeToggle');
  const options = arc.querySelectorAll('.theme-option');

  // Применяет тему: 'dark' — дефолт (не добавляем класс), 'light'/'pink' добавляем класс
  function applyTheme(theme){
    document.documentElement.classList.remove('light','pink','gta','NewYear','anime'); 
    if(theme && theme !== 'dark'){
      document.documentElement.classList.add(theme); 
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
// Функция уведомления
document.addEventListener('DOMContentLoaded', function() {
  const notification = document.getElementById('update-notification');
  const closeButton = document.getElementById('close-notification');
  const currentVersion = '6.7'; 

  function getCookie(name) {}
  function setCookie(name, value, days) {}

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

// -------------------------------------------------------------------------------------------------------------------------------------
// Скрипт обновления сайта при загрузке браузера
document.addEventListener('selectionchange', () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    if (container.classList && container.classList.contains('container')) {
      selection.removeAllRanges(); 
    }

    const startCard = range.startContainer.parentElement.closest('.item-text, .cell-text');
    const endCard = range.endContainer.parentElement.closest('.item-text, .cell-text');

    if (startCard !== endCard) {
      selection.removeAllRanges(); 
    }
  }
});