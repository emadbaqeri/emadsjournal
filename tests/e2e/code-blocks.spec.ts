import { expect, test } from '@playwright/test';

const fileSample = 'function twoNumberSum';

test.describe('code blocks', () => {
  test.use({
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  test('copy skips line numbers and light theme uses the data-theme selector', async ({ page }) => {
    await page.goto('/dev/kitchen-sink');
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', 'light');

    const file = page.locator('.expressive-code', { hasText: 'two-number-sum.ts' }).first();
    await expect(file.locator('.ln').first()).toBeVisible();
    const copy = file.locator('.copy button');
    await expect(copy).toHaveAttribute('aria-label', 'Copy code');
    await copy.click();
    await expect(file.locator('.feedback')).toContainText('Copied');

    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(fileSample);
    expect(copied).toContain('return [];');
    expect(copied.split('\n').some((line) => /^\s*\d+\s+\S/.test(line))).toBe(false);
    expect(copied.startsWith('1')).toBe(false);

    const snippet = page.locator('.expressive-code', { hasText: 'answer.zig' }).first();
    await expect(snippet.locator('.ln')).toHaveCount(0);
    const terminal = page.locator('.expressive-code').filter({ has: page.locator('.title', { hasText: 'build' }) }).first();
    await expect(terminal.locator('.frame')).toHaveClass(/is-terminal/);
    await expect(terminal.locator('.ln')).toHaveCount(0);

    const themeCss = await page.evaluate(() => {
      const found: string[] = [];
      for (const sheet of document.styleSheets) {
        let rules: CSSRuleList;
        try {
          rules = sheet.cssRules;
        } catch {
          continue;
        }
        for (const rule of rules) {
          const text = rule.cssText;
          if (!text.includes('[data-theme="light"]') && !text.includes("[data-theme='light']")) continue;
          if (text.includes('--ec-') || text.includes('expressive-code') || text.includes('--color-code-')) {
            found.push(text.slice(0, 180));
          }
        }
      }
      return found;
    });
    expect(themeCss.length).toBeGreaterThan(0);
    expect(themeCss.join('\n')).not.toMatch(/prefers-color-scheme/);

    await page.addInitScript(() => {
      localStorage.setItem('emaaad-theme', 'light');
    });
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
    const background = await file.locator('pre').evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(background).toBe('rgb(242, 239, 231)');

    await page.goto('/algorithms/two-number-sum');
    const scroller = page.locator('[data-panel]:not([hidden]) [data-solution-scroll]');
    const header = page.locator('[data-panel]:not([hidden]) .frame .header');
    const before = await header.boundingBox();
    const scrollable = await scroller.evaluate((el) => ({
      overflows: el.scrollHeight > el.clientHeight + 8,
      tabindex: el.getAttribute('tabindex'),
    }));
    expect(scrollable.overflows).toBe(true);
    expect(scrollable.tabindex).toBe('0');
    await expect(page.locator('.expressive-code pre[tabindex]')).toHaveCount(0);
    await scroller.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    await expect(page.locator('[data-solution-stage]')).toHaveAttribute('data-bottom-fade', 'off');
    const after = await header.boundingBox();
    expect(after?.y).toBeCloseTo(before?.y ?? 0, 0);
    const tail = await scroller.innerText();
    expect(tail.trim().endsWith('}')).toBe(true);
  });
});
