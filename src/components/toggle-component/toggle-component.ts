import { BaseComponent, RenderOptions } from "../../utilities/base-component";
import templateContent from "./toggle-component.template.html?raw";
import "./toggle-component.css";

class ToggleComponent extends BaseComponent {
  private checkboxElement: HTMLInputElement | null = null;
  private labelElement: HTMLLabelElement | null = null;

  static get observedAttributes(): string[] {
    return ["name", "size", "checked", "disabled"];
  }

  connectedCallback(): void {
    this.render();
    this.setupEventListeners();
    this.updateToggleState();
    this.updateDisabledState();
    this.applySizeClasses();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (oldValue === newValue) return;

    switch (name) {
      case "checked":
        this.updateToggleState();
        break;
      case "disabled":
        this.updateDisabledState();
        break;
      case "size":
        this.applySizeClasses();
        break;
      case "name":
        this.updateName();
        break;
    }
  }

  protected render(): void {
    super.render({
      template: templateContent,
      componentName: "toggle-component",
      moduleUrl: import.meta.url,
    } as RenderOptions);

    this.checkboxElement = this.shadow.querySelector<HTMLInputElement>(
      'input[type="checkbox"]'
    );
  }

  private setupEventListeners(): void {
    if (this.checkboxElement) {
      this.checkboxElement.addEventListener("change", (event) => {
        const target = event.target as HTMLInputElement;

        // Update the component's checked attribute to match the checkbox state
        if (target.checked) {
          this.setAttribute("checked", "");
        } else {
          this.removeAttribute("checked");
        }

        // Dispatch a custom event
        this.dispatchEvent(
          new CustomEvent("toggle", {
            detail: {
              checked: target.checked,
              name: this.getAttribute("name") || "",
              value: target.value,
            },
            bubbles: true,
          })
        );
      });
    }
  }

  private updateToggleState(): void {
    if (this.checkboxElement) {
      this.checkboxElement.checked = this.hasAttribute("checked");
    }
  }

  private updateDisabledState(): void {
    if (this.checkboxElement) {
      this.checkboxElement.disabled = this.hasAttribute("disabled");
    }
  }

  private applySizeClasses(): void {
    const toggleDiv =
      this.shadow.querySelector<HTMLElement>(".x-toggle__switch");
    if (!toggleDiv) return;

    // Remove existing size classes
    toggleDiv.classList.remove(
      "x-toggle__switch--sm",
      "x-toggle__switch--md",
      "x-toggle__switch--lg"
    );

    const size = this.getAttribute("size") || "md";
    toggleDiv.classList.add(`x-toggle__switch--${size}`);
  }

  private updateName(): void {
    if (this.checkboxElement) {
      const name = this.getAttribute("name");
      if (name) {
        this.checkboxElement.name = name;
      }
    }
  }

  // Public methods for programmatic control
  public get checked(): boolean {
    return this.hasAttribute("checked");
  }

  public set checked(value: boolean) {
    if (value) {
      this.setAttribute("checked", "");
    } else {
      this.removeAttribute("checked");
    }
  }

  public get disabled(): boolean {
    return this.hasAttribute("disabled");
  }

  public set disabled(value: boolean) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  public get value(): string {
    return this.checkboxElement?.value || "";
  }

  public set value(newValue: string) {
    if (this.checkboxElement) {
      this.checkboxElement.value = newValue;
    }
  }
}

customElements.define("x-toggle", ToggleComponent);
