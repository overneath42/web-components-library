import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect } from 'storybook/test';
import './tabs-component';

interface TabsArgs {
  currentTab: number;
  hideClass: string;
}

const meta: Meta<TabsArgs> = {
  title: 'Components/TabsComponent',
  component: 'x-tabs',
  parameters: {
    vitest: true,
  },
  argTypes: {
    currentTab: {
      control: { type: 'number', min: 0, max: 3 },
      description: 'Index of the currently active tab',
    },
    hideClass: {
      control: 'text',
      description: 'CSS class used to hide inactive tab panels',
    },
  },
  args: {
    currentTab: 0,
    hideClass: 'hidden',
  },
};

export default meta;
type Story = StoryObj<TabsArgs>;

export const Default = () => `
  <x-tabs current-tab="0" hide-class="hidden">
    <div slot="tab-0" data-label="First Tab">
      <h3>First Tab Content</h3>
      <p>This is the content for the first tab. It contains some sample text to demonstrate how the tab content is displayed.</p>
    </div>
    <div slot="tab-1" data-label="Second Tab">
      <h3>Second Tab Content</h3>
      <p>This is the content for the second tab. Notice how only one tab's content is visible at a time.</p>
    </div>
    <div slot="tab-2" data-label="Third Tab">
      <h3>Third Tab Content</h3>
      <p>This is the content for the third tab. Each tab can contain any HTML content.</p>
    </div>
  </x-tabs>
`;

export const WithIcons = () => `
  <x-tabs current-tab="0" hide-class="hidden">
    <div slot="tab-0" data-label="Home" data-icon="🏠">
      <h3>Home Content</h3>
      <p>Welcome to the home page! This tab includes an icon in the tab button.</p>
    </div>
    <div slot="tab-1" data-label="Settings" data-icon="⚙️">
      <h3>Settings</h3>
      <p>Configure your preferences here. Notice the settings icon in the tab.</p>
    </div>
    <div slot="tab-2" data-label="Profile" data-icon="👤">
      <h3>User Profile</h3>
      <p>View and edit your profile information. This tab has a user icon.</p>
    </div>
  </x-tabs>
`;

export const WithHiddenTabs = () => `
  <x-tabs current-tab="0" hide-class="hidden">
    <div slot="tab-0" data-label="Visible Tab 1">
      <h3>First Visible Tab</h3>
      <p>This tab is always visible.</p>
    </div>
    <div slot="tab-1" data-label="Hidden Tab" data-visible="false">
      <h3>Hidden Tab Content</h3>
      <p>This tab should not be visible in the tab list.</p>
    </div>
    <div slot="tab-2" data-label="Visible Tab 2">
      <h3>Second Visible Tab</h3>
      <p>This is another visible tab. The hidden tab should be skipped.</p>
    </div>
  </x-tabs>
`;

export const SecondTabActive = () => `
  <x-tabs current-tab="1" hide-class="hidden">
    <div slot="tab-0" data-label="Tab 1">
      <h3>Tab 1 Content</h3>
      <p>This is the first tab, but it's not active by default.</p>
    </div>
    <div slot="tab-1" data-label="Tab 2">
      <h3>Tab 2 Content</h3>
      <p>This tab is active by default (current-tab="1").</p>
    </div>
    <div slot="tab-2" data-label="Tab 3">
      <h3>Tab 3 Content</h3>
      <p>This is the third tab.</p>
    </div>
  </x-tabs>
`;

export const WithInteractiveTest = {
  render: () => `
    <x-tabs current-tab="0" hide-class="hidden">
      <div slot="tab-0" data-label="Test Tab 1">
        <h3>First Tab for Testing</h3>
        <p>This tab is used for interaction testing.</p>
      </div>
      <div slot="tab-1" data-label="Test Tab 2">
        <h3>Second Tab for Testing</h3>
        <p>Click between tabs to test the functionality.</p>
      </div>
      <div slot="tab-2" data-label="Test Tab 3">
        <h3>Third Tab for Testing</h3>
        <p>All tabs should work correctly.</p>
      </div>
    </x-tabs>
  `,
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const tabsComponent = canvas.querySelector('x-tabs');
    
    // Wait for component to be fully initialized
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Test that the component renders with tabs
    const shadowRoot = tabsComponent?.shadowRoot;
    const tabButtons = shadowRoot?.querySelectorAll('.x-tabs__button');
    expect(tabButtons?.length).toBe(3);
    
    // Test that first tab is active by default
    const firstTabButton = tabButtons?.[0] as HTMLElement;
    expect(firstTabButton?.getAttribute('aria-selected')).toBe('true');
    
    // Test that panels exist
    const tabPanels = shadowRoot?.querySelectorAll('.x-tabs__panel');
    expect(tabPanels?.length).toBe(3);
    
    // Test that only first panel is visible
    const firstPanel = tabPanels?.[0] as HTMLElement;
    const secondPanel = tabPanels?.[1] as HTMLElement;
    expect(firstPanel?.classList.contains('hidden')).toBe(false);
    expect(secondPanel?.classList.contains('hidden')).toBe(true);
  },
} satisfies StoryObj;
