let active = false;
const appliedVideos = new WeakSet();

function makeResizable(video) {
  if (appliedVideos.has(video)) return;
  appliedVideos.add(video);

  const resizer = document.createElement('div');
  resizer.className = 'video-resize-handle';
  video.parentElement.appendChild(resizer);

  let startX, startY, startWidth, startHeight;

  resizer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = video.offsetWidth;
    startHeight = video.offsetHeight;

    const onMouseMove = (e) => {
      video.style.width = `${startWidth + (e.clientX - startX)}px`;
      video.style.height = `${startHeight + (e.clientY - startY)}px`;
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  const repositionHandle = () => {
    const rect = video.getBoundingClientRect();
    resizer.style.top = `${window.scrollY + rect.bottom - 8}px`;
    resizer.style.left = `${window.scrollX + rect.right - 8}px`;
  };

  repositionHandle();
  window.addEventListener('resize', repositionHandle);
  window.addEventListener('scroll', repositionHandle);
  const observer = new ResizeObserver(repositionHandle);
  observer.observe(video);
}

function activateResizer() {
  document.querySelectorAll('video').forEach(makeResizable);
  const observer = new MutationObserver(() => {
    document.querySelectorAll('video').forEach(makeResizable);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function deactivateResizer() {
  document.querySelectorAll('.video-resize-handle').forEach(el => el.remove());
  appliedVideos.clear();
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.toggleResizer !== undefined) {
    active = request.toggleResizer;
    if (active) activateResizer();
    else deactivateResizer();
  }
});

chrome.storage.local.get('videoResizerEnabled', ({ videoResizerEnabled }) => {
  if (videoResizerEnabled) activateResizer();
});
