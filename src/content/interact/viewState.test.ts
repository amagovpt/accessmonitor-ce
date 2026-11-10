import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { captureViewState, restoreViewState } from './viewState';

interface FakeElement {
  isConnected: boolean;
  focus: ReturnType<typeof vi.fn>;
  blur: ReturnType<typeof vi.fn>;
}

const makeElement = (): FakeElement => ({
  isConnected: true,
  focus: vi.fn(),
  blur: vi.fn(),
});

const body = makeElement();
let activeElement: FakeElement;
const scrollTo = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
  activeElement = body;
  (globalThis as Record<string, unknown>).window = {
    scrollX: 10,
    scrollY: 250,
    scrollTo,
  };
  (globalThis as Record<string, unknown>).document = {
    body,
    get activeElement() {
      return activeElement;
    },
  };
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).document;
});

describe('viewState', () => {
  it('repõe a posição de scroll', () => {
    const state = captureViewState();
    expect(state).toMatchObject({ scrollX: 10, scrollY: 250 });

    restoreViewState(state);

    expect(scrollTo).toHaveBeenCalledWith(10, 250);
  });

  it('repõe o foco no elemento que o tinha, sem fazer scroll', () => {
    const input = makeElement();
    activeElement = input;
    const state = captureViewState();

    const moved = makeElement();
    activeElement = moved;
    restoreViewState(state);

    expect(input.focus).toHaveBeenCalledWith({ preventScroll: true });
  });

  it('tira o foco ao elemento ganho na avaliação se nada estava focado', () => {
    const state = captureViewState();

    const moved = makeElement();
    activeElement = moved;
    restoreViewState(state);

    expect(moved.blur).toHaveBeenCalled();
  });

  it('não mexe no foco se não mudou', () => {
    const state = captureViewState();

    restoreViewState(state);

    expect(body.focus).not.toHaveBeenCalled();
    expect(body.blur).not.toHaveBeenCalled();
  });

  it('ignora o elemento focado antes se já saiu do documento', () => {
    const input = makeElement();
    activeElement = input;
    const state = captureViewState();

    input.isConnected = false;
    const moved = makeElement();
    activeElement = moved;
    restoreViewState(state);

    expect(input.focus).not.toHaveBeenCalled();
    expect(moved.blur).toHaveBeenCalled();
  });
});
