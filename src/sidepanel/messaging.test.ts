import { beforeEach, describe, expect, it, vi } from 'vitest';

import { sendToActiveTab } from './messaging';

const FILES = ['qwPage.js', 'util.js', 'content.js'];

const chromeMock = {
  tabs: { query: vi.fn(), sendMessage: vi.fn() },
  scripting: { executeScript: vi.fn() },
  runtime: {
    getManifest: () => ({ content_scripts: [{ js: FILES, matches: [] }] }),
  },
};

const noReceiver = () =>
  new Error('Could not establish connection. Receiving end does not exist.');

beforeEach(() => {
  vi.resetAllMocks();
  (globalThis as { chrome?: unknown }).chrome = chromeMock;
  chromeMock.tabs.query.mockResolvedValue([{ id: 7, url: 'https://x.pt' }]);
});

describe('sendToActiveTab', () => {
  it('envia a ação à aba ativa sem injetar quando o script já lá está', async () => {
    chromeMock.tabs.sendMessage.mockResolvedValue('<html></html>');

    await expect(sendToActiveTab('getHTML')).resolves.toBe('<html></html>');

    expect(chromeMock.tabs.sendMessage).toHaveBeenCalledWith(7, {
      action: 'getHTML',
      message: undefined,
    });
    expect(chromeMock.scripting.executeScript).not.toHaveBeenCalled();
  });

  it('injeta os scripts do manifest e repete se o content script não existir', async () => {
    chromeMock.tabs.sendMessage
      .mockRejectedValueOnce(noReceiver())
      .mockResolvedValueOnce('ok');
    chromeMock.scripting.executeScript.mockResolvedValue([]);

    await expect(sendToActiveTab('getHTML')).resolves.toBe('ok');

    expect(chromeMock.scripting.executeScript).toHaveBeenCalledWith({
      target: { tabId: 7 },
      files: FILES,
    });
    expect(chromeMock.tabs.sendMessage).toHaveBeenCalledTimes(2);
  });

  it('não injeta por outros erros', async () => {
    chromeMock.tabs.sendMessage.mockRejectedValue(new Error('outro erro'));

    await expect(sendToActiveTab('getHTML')).rejects.toThrow('outro erro');
    expect(chromeMock.scripting.executeScript).not.toHaveBeenCalled();
  });

  it('explica a falha quando a página não permite injeção', async () => {
    chromeMock.tabs.sendMessage.mockRejectedValue(noReceiver());
    chromeMock.scripting.executeScript.mockRejectedValue(
      new Error('Cannot access a chrome:// URL'),
    );

    await expect(sendToActiveTab('getHTML')).rejects.toThrow(
      /Cannot inject the content script in this page: Cannot access a chrome/,
    );
    expect(chromeMock.tabs.sendMessage).toHaveBeenCalledTimes(1);
  });

  it('só tenta reinjetar uma vez', async () => {
    chromeMock.tabs.sendMessage.mockRejectedValue(noReceiver());
    chromeMock.scripting.executeScript.mockResolvedValue([]);

    await expect(sendToActiveTab('getHTML')).rejects.toThrow(
      'Receiving end does not exist',
    );
    expect(chromeMock.scripting.executeScript).toHaveBeenCalledTimes(1);
  });
});
