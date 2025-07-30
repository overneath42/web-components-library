import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { expect } from 'storybook/test';
import './index.ts';

interface ToggleComponentArgs {
  name: string;
  size: 'sm' | 'md' | 'lg';
  checked?: boolean;
  disabled?: boolean;
}

const meta: Meta<ToggleComponentArgs> = {
  title: 'Components/Toggle',
  component: 'x-toggle',
  parameters: {
    layout: 'centered',
    vitest: true,
    docs: {
      description: {
        component: 'A customizable toggle component that functions as a styled checkbox input. Supports different sizes, labels, and states.'
      }
    }
  },
  argTypes: {
    name: {
      control: 'text',
      description: 'The name attribute for the form input'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the toggle switch'
    },
    checked: {
      control: 'boolean',
      description: 'Whether the toggle is checked'
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the toggle is disabled'
    }
  },
  args: {
    name: 'toggle',
    size: 'md',
    checked: false,
    disabled: false
  }
} satisfies Meta<ToggleComponentArgs>;

export default meta;

export const Default = () =>
  `<x-toggle name="toggle" size="md">Toggle Option</x-toggle>`;

export const Checked = () =>
  `<x-toggle name="toggle" size="md" checked>Toggle Option</x-toggle>`;

export const WithoutLabel = () =>
  `<x-toggle name="toggle" size="md"></x-toggle>`;

export const Small = () =>
  `<x-toggle name="toggle" size="sm">Small toggle</x-toggle>`;

export const Large = () =>
  `<x-toggle name="toggle" size="lg">Large toggle</x-toggle>`;

export const Disabled = () =>
  `<x-toggle name="toggle" size="md" disabled>Disabled toggle</x-toggle>`;

export const Interactive = {
  render: () =>
    `<x-toggle name="toggle" size="md">Click to toggle</x-toggle>`,
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const toggle = canvas.querySelector('x-toggle') as any;
    expect(toggle).not.toBeNull();
    // Access the input inside the shadow DOM
    const input = toggle.shadowRoot?.querySelector('input[type="checkbox"]');
    expect(input).not.toBeNull();
    // Ensure starts unchecked
    expect(toggle.checked).toBe(false);
    // Simulate click on input
    input!.click();
    // Test that it becomes checked
    expect(toggle.checked).toBe(true);
  }
} satisfies StoryObj;

export const AllSizes = {
  render: () => `
    <div style="display: flex; flex-direction: column; gap: 1rem; align-items: flex-start;">
      <x-toggle name="small" size="sm">Small toggle</x-toggle>
      <x-toggle name="medium" size="md">Medium toggle</x-toggle>
      <x-toggle name="large" size="lg">Large toggle</x-toggle>
    </div>
  `,
  parameters: {
    controls: { disable: true }
  }
} satisfies StoryObj;
