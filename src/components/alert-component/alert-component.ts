import { BaseComponent, RenderOptions } from "../../utilities/base-component";
import templateContent from "./alert-component.template.html?raw";
import "./alert-component.css";

class AlertComponent extends BaseComponent {
  private timerId: number | null = null;

  static get observedAttributes(): string[] {
    return ["type", "closeable", "self-destruct-in"];
  }

  connectedCallback(): void {
    this.render();
    this.applyTypeStyles();
    this.setupDestructTimer();
    this.setCloseButtonVisibility();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (oldValue === newValue) return;
    if (name === "type") this.applyTypeStyles();
    if (name === "self-destruct-in") this.setupDestructTimer();
    if (name === "closeable") this.setCloseButtonVisibility();
  }

  protected render(): void {
    super.render({
      template: templateContent,
      componentName: "alert-component",
      moduleUrl: import.meta.url,
    } as RenderOptions);
    
    this.shadow
      .querySelector(".close")
      ?.addEventListener("click", () => this.remove());
  }

  private setCloseButtonVisibility(): void {
    const closeButton =
      this.shadow.querySelector<HTMLElement>(".x-alert__close");

    if (closeButton) {
      closeButton.hidden = !this.hasAttribute("closeable");

      if (closeButton.hidden) {
        closeButton.removeEventListener("click", () => this.remove());
      } else {
        closeButton.addEventListener("click", () => this.remove());
      }
    }
  }

  private applyTypeStyles(): void {
    const wrapper = this.shadow.querySelector(".x-alert");
    if (!wrapper) return;

    const type = this.getAttribute("type") || "info";
    wrapper.className = "x-alert";
    wrapper.classList.add(`x-alert--${type}`);
  }

  private setupDestructTimer(): void {
    if (this.timerId) clearTimeout(this.timerId);

    const selfDestructIn = this.getAttribute("self-destruct-in");
    if (selfDestructIn) {
      const seconds = parseInt(selfDestructIn, 10);
      if (!isNaN(seconds) && seconds > 0) {
        this.timerId = window.setTimeout(() => this.remove(), seconds * 1000);
      }
    }
  }
}

customElements.define("x-alert", AlertComponent);
