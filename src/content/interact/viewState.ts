// Captures and restores the view state (scroll position and active element) of the page.
export interface ViewState {
  scrollX: number;
  scrollY: number;
  activeElement: Element | null;
}

export function captureViewState(): ViewState {
  return {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    activeElement: document.activeElement,
  };
}

function canFocus(element: Element | null): element is HTMLElement {
  return (
    element !== null &&
    typeof (element as HTMLElement).focus === 'function' &&
    element.isConnected
  );
}

export function restoreViewState(state: ViewState): void {
  window.scrollTo(state.scrollX, state.scrollY);

  const current = document.activeElement;
  if (current === state.activeElement) {
    return;
  }

  if (state.activeElement !== document.body && canFocus(state.activeElement)) {
    state.activeElement.focus({ preventScroll: true });
  } else if (canFocus(current)) {
    // Nothing was focused before the evaluation
    current.blur();
  }
}
