import type { Meta, StoryObj } from "@storybook/web-components-vite";
import { expect } from "storybook/test";

import "./index.ts";

export default {
  title: "Components/Alert",
  component: "x-alert",
  parameters: {
    vitest: true,
  },
} satisfies Meta;

export const Info = () =>
  `<x-alert type="info">This is an info alert.</x-alert>`;

export const Warning = () =>
  `<x-alert type="warning">This is a warning alert.</x-alert>`;

export const Danger = () =>
  `<x-alert type="danger">This is a danger alert.</x-alert>`;

export const Success = () =>
  `<x-alert type="success">This is a success alert.</x-alert>`;

export const WithCloseButton = {
  render: () =>
    `<x-alert type="info" closeable>This alert can be closed.</x-alert>`,
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    const alert = canvas.querySelector("x-alert");
    const closeButton =
      alert?.shadowRoot?.querySelector<HTMLButtonElement>(".x-alert__close");
    expect(closeButton).not.toBeNull();
    expect(closeButton?.hidden).toBe(false);
    // closeButton?.click();
    // expect(alert).not.toBeInTheDocument();
  },
} satisfies StoryObj;

export const WithSelfDestruct = {
  render: () =>
    `<x-alert type="info" self-destruct-in="1">This alert will self-destruct in 1 second.</x-alert>`,
  play: async ({ canvasElement }) => {
    const canvas = canvasElement as HTMLElement;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(canvas.querySelector("x-alert")).not.toBeInTheDocument();
  },
} satisfies StoryObj;
