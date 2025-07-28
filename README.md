
# Web Components Library

A reusable library of Web Components authored in TypeScript, exposed as ES modules, and designed for easy integration into modern web applications.

## Features

- **TypeScript-first:** All components are written in TypeScript for type safety and maintainability.
- **Standard Web Components:** Each component is a custom element using the Shadow DOM for encapsulation.
- **Modular Build:** Components are built as independent ES modules, with their own CSS and HTML templates.
- **Storybook Integration:** Components are documented and tested in Storybook, with Vitest for unit tests.

## Getting Started

### Install Dependencies

```sh
yarn install
```

### Build All Components

```sh
yarn build
```

The build output will be in the `dist/` directory, with each component in its own folder (e.g., `dist/alert-component/index.js`).

### Run Storybook

```sh
yarn storybook
```

This will start Storybook at [http://localhost:6006](http://localhost:6006), where you can browse, interact with, and test all components.

### Run Tests

```sh
yarn test
```

This runs all Vitest unit tests, including those integrated with Storybook stories.

## Using Components in Your Project

Import the desired component as an ES module:

```js
import 'web-components-library/dist/alert-component/index.js';
```

Then use the custom element in your HTML:

```html
<x-alert type="info" closeable>This is an info alert.</x-alert>
```

## Project Structure

- `src/components/` — Each component in its own folder:
  - `<component-name>.ts` — Web Component definition (TypeScript, Shadow DOM, registers custom element)
  - `<component-name>.template.html` — HTML template for the component
  - `<component-name>.css` — Scoped CSS for the component
  - `<component-name>.stories.ts` — Storybook stories and Vitest tests
- `dist/` — Build output (one folder per component)
- `vite.config.ts` — Vite build configuration (auto-discovers all components)
- `vitest.config.ts` — Vitest configuration
- `storybook/` — Storybook configuration

## Contributing: Adding a New Component

1. **Create a new folder** in `src/components/` using kebab-case (e.g., `my-component`).
2. **Add the following files** to your component folder (using `my-component' for example)
   - `my-component.ts` — Define your Web Component class (extend `HTMLElement`, use Shadow DOM, register with `customElements.define('x-my-component', ...)`).
   - `my-component.template.html` — The HTML template for your component.
   - `my-component.css` — Scoped CSS for your component. Use class names prefixed with your component name to avoid conflicts. Processed though PostCSS to allow for Sass-style nesting.
   - `my-component.stories.ts` — Storybook stories and Vitest tests for your component.
   - `index.ts` - Exports all content from `my-component.ts`.
3. **Import your CSS and template** in `my-component.ts` using dynamic imports and the `prependCSS` utility for style encapsulation.
4. **Build the project:**
   ```sh
   yarn build
   ```
5. **Test your component:**
   - Run Storybook (`yarn storybook`) to preview and interact with your component.
   - Run tests (`yarn test`) to ensure your component works as expected.
6. **Submit a pull request** with your new component and tests.

### Component Guidelines

- Use TypeScript interfaces/types for props and state.
- Use the Shadow DOM and slots for encapsulation and flexibility.
- Keep logic, template, and styles modular and self-contained.
- Write clear, concise, and well-documented code.
- Provide at least one Storybook story and a basic test for each component.

## License

MIT

