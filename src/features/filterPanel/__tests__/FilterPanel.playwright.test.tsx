import { test, expect } from '@playwright/experimental-ct-react';
import { BrowserRouter } from 'react-router-dom';
import { O } from '@mobily/ts-belt';

// Create a story component for testing
const FilterPanelStory = () => {
  const mockFilters = {
    search: O.None,
    genre: O.None,
    artist: O.None,
    sortBy: O.None,
    sortOrder: O.None
  };

  const mockUpdateFilters = (updates: any) => {
    console.log('Filter updates:', updates);
  };

  // We need to dynamically import the component inside the story
  const React = require('react');
  const { useState, useEffect } = React;
  const [FilterPanel, setFilterPanel] = useState(null);

  useEffect(() => {
    import('../filterPanel').then(module => {
      setFilterPanel(() => module.FilterPanel);
    });
  }, []);

  if (!FilterPanel) return React.createElement('div', null, 'Loading...');

  return React.createElement(
    BrowserRouter,
    null,
    React.createElement(FilterPanel, {
      // Pass mock data as props would normally come from useFilterParams
      filters: mockFilters,
      updateFilters: mockUpdateFilters
    })
  );
};

test('FilterPanel component renders and accepts input in browser', async ({ mount }) => {
  const component = await mount(<FilterPanelStory />);
  
  // Wait for the component to load
  await expect(component.getByText('Loading...')).not.toBeVisible();
  
  // Test that search input is present and functional
  const searchInput = component.locator('input[placeholder*="search"]');
  await expect(searchInput).toBeVisible();
  
  // Test user interaction
  await searchInput.fill('component test');
  await expect(searchInput).toHaveValue('component test');
}); 