import { test, expect } from '@playwright/experimental-ct-react';
import { type Page } from '@playwright/test';
import { BrowserRouter } from 'react-router-dom';
import { FilterPanel } from '../filterPanel';

test.describe('FilterPanel Integration (Playwright)', () => {
  test('should work with real browser environment and URL synchronization', async ({ mount, page }: { mount: any, page: Page }) => {
    const component = await mount(
      <BrowserRouter>
        <FilterPanel genres={['Rock', 'Jazz', 'Pop']} artists={['Artist1', 'Artist2']} />
      </BrowserRouter>
    );

    const searchInput = component.getByTestId('search-input');
    await expect(searchInput).toBeVisible();
    
    await searchInput.fill('browser integration test');
    await expect(searchInput).toHaveValue('browser integration test');
    
    const url = page.url();
    expect(url).toContain('search=browser+integration+test');
  });

  test('should load initial state from URL parameters', async ({ mount, page }: { mount: any, page: Page }) => {
    await page.goto('/?search=initial-test&genre=Rock');
    
    const component = await mount(
      <BrowserRouter>
        <FilterPanel genres={['Rock', 'Jazz', 'Pop']} artists={['Artist1', 'Artist2']} />
      </BrowserRouter>
    );

    const searchInput = component.getByTestId('search-input');
    await expect(searchInput).toHaveValue('initial-test');
  });

  test('should handle genre selection in real browser', async ({ mount, page }: { mount: any, page: Page }) => {
    const component = await mount(
      <BrowserRouter>
        <FilterPanel genres={['Rock', 'Jazz', 'Pop']} artists={['Artist1', 'Artist2']} />
      </BrowserRouter>
    );

    const genreSelect = component.getByTestId('filter-genre');
    await genreSelect.click();
    
    await component.getByText('Rock').click();
    
    const url = page.url();
    expect(url).toContain('genre=Rock');
  });
});
