// Adds a "Copy" button to the title bar of every code window on the page.
export function addCopyButtons() {
  document.querySelectorAll<HTMLElement>('.code-window').forEach((win) => {
    const pre = win.querySelector('pre');
    const bar = win.querySelector('.code-bar');
    if (!pre || !bar || bar.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.type = 'button';
    btn.textContent = 'Copy';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        btn.textContent = 'Copied ✓';
      } catch {
        btn.textContent = 'Press ⌘C';
      }
      setTimeout(() => (btn.textContent = 'Copy'), 1600);
    });
    bar.appendChild(btn);
  });
}
