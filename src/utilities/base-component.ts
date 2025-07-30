import { prependCSS } from "./prepend-css";

export interface RenderOptions {
  template: string;
  componentName: string;
  moduleUrl: string;
}

export class BaseComponent extends HTMLElement {
  protected shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  protected render({
    template,
    componentName,
    moduleUrl,
  }: RenderOptions): void {
    this.shadow.innerHTML = template;
    prependCSS(new URL(`./${componentName}.css`, moduleUrl).href, this.shadow);
  }
}
