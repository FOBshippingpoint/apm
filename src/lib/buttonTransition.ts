const buttonTypes = [
  'primary',
  'secondary',
  'success',
  'danger',
  'warning',
  'info',
  'light',
  'dark',
  'link',
];

/**
 * Show loading spinner in the button.
 *
 * @param {HTMLButtonElement} btn - An element of the button to be
 * @param {string} [message] - A message to show.
 * @returns {{enableButton:()=>void}} Returns a function to enable the button.
 */
export function loading(btn: HTMLButtonElement, message?: string) {
  btn.disabled = true;
  const beforeHTML = btn.innerHTML;
  btn.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>' +
    '<span class="visually-hidden">Loading...</span>';

  return {
    enableButton: function () {
      btn.innerHTML = message ?? beforeHTML;
      btn.disabled = false;
    },
  };
}

/**
 * Show a message in the button.
 *
 * @param {HTMLButtonElement} btn - An element of the button to be changed
 * @param {string} message - A message to be shown
 * @param {string} [type] - A type of the button to be changed to
 */
export function message(
  btn: HTMLButtonElement,
  message: string,
  type?: string
) {
  btn.innerText = message;
  if (!type) return;
  for (const originalType of buttonTypes) {
    for (const prefix of ['btn-', 'btn-outline-']) {
      const btnOriginalType = prefix + originalType;
      const btnNewType = prefix + type;
      if (btn.classList.replace(btnOriginalType, btnNewType)) {
        setTimeout(() => {
          btn.classList.replace(btnNewType, btnOriginalType);
        }, 3000);
        return;
      }
    }
  }
}
