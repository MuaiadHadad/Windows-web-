const windows = document.querySelectorAll('.window');
const icons = document.querySelectorAll('.desktop-icon');
const settingsPanel = document.getElementById('settingsPanel');
const settingsShortcut = document.getElementById('settingsShortcut');
const wallpaperButtons = document.querySelectorAll('.wallpaper-option');
const wallpaperColor = document.getElementById('wallpaperColor');
const desktop = document.getElementById('desktop');
const clock = document.getElementById('clock');
const iconGrid = document.getElementById('iconGrid');
const taskbarIcons = document.querySelectorAll('.taskbar-icon[data-app]');

let activeZIndex = 10;
let draggedIcon = null;

const openWindow = (app) => {
  const targetWindow = document.querySelector(`.window[data-app="${app}"]`);
  if (!targetWindow) return;
  activeZIndex += 1;
  targetWindow.style.zIndex = activeZIndex;
  targetWindow.classList.add('visible');
};

const closeWindow = (node) => {
  node.classList.remove('visible');
};

windows.forEach((win) => {
  win.querySelector('.close-window').addEventListener('click', () => closeWindow(win));
  win.addEventListener('mousedown', () => {
    activeZIndex += 1;
    win.style.zIndex = activeZIndex;
  });
});

const registerLaunchers = (nodeList) => {
  nodeList.forEach((trigger) => {
    trigger.addEventListener('click', () => openWindow(trigger.dataset.app));
  });
};

registerLaunchers(icons);
registerLaunchers(taskbarIcons);

icons.forEach((icon) => {

  icon.addEventListener('dragstart', (event) => {
    draggedIcon = icon;
    icon.classList.add('dragging');
    event.dataTransfer.effectAllowed = 'move';
  });

  icon.addEventListener('dragend', () => {
    icon.classList.remove('dragging');
    draggedIcon = null;
  });
});

iconGrid.addEventListener('dragover', (event) => {
  event.preventDefault();
  const target = event.target.closest('.desktop-icon');
  if (!target || target === draggedIcon) return;
  const children = [...iconGrid.children];
  const dragIndex = children.indexOf(draggedIcon);
  const targetIndex = children.indexOf(target);
  if (dragIndex < targetIndex) {
    iconGrid.insertBefore(draggedIcon, target.nextSibling);
  } else {
    iconGrid.insertBefore(draggedIcon, target);
  }
});

iconGrid.addEventListener('drop', (event) => {
  event.preventDefault();
});

const toggleSettings = () => {
  settingsPanel.classList.toggle('hidden');
};

settingsShortcut.addEventListener('click', toggleSettings);
settingsPanel.querySelector('.close-settings').addEventListener('click', toggleSettings);
settingsPanel.addEventListener('click', (event) => {
  if (event.target === settingsPanel) {
    toggleSettings();
  }
});

wallpaperButtons.forEach((button) => {
  button.style.background = button.dataset.wallpaper;
  button.addEventListener('click', () => {
    desktop.style.setProperty('--wallpaper', button.dataset.wallpaper);
  });
});

wallpaperColor.addEventListener('change', (event) => {
  desktop.style.setProperty('--wallpaper', event.target.value);
});

const updateClock = () => {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
  clock.textContent = formatted;
};

updateClock();
setInterval(updateClock, 1000);

// Abrir janela inicial para demonstrar
openWindow('explorer');
