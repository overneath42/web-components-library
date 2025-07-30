import { BaseComponent, RenderOptions } from "../../utilities/base-component";
import templateContent from "./tabs-component.template.html?raw";
import "./tabs-component.css";

// Class prefix for tabs component
const classPrefix = "x-tabs";

// Factory function for generating class selectors
function s(name: string, useModifier: boolean = false): string {
  return useModifier ? `.x-tabs--${name}` : `.x-tabs__${name}`;
}

interface TabData {
  label: string;
  id: string;
  icon?: string;
  isVisible: boolean;
  element: HTMLElement;
}

class TabsComponent extends BaseComponent {
  private currentTabIndex: number = 0;
  private tabs: TabData[] = [];
  private hideClass: string = "hidden";

  static get observedAttributes(): string[] {
    return ["current-tab", "hide-class"];
  }

  connectedCallback(): void {
    this.render();
    this.setupTabs();
    this.addEventListeners();
    this.updateCurrentTab();
  }

  attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ): void {
    if (oldValue === newValue) return;

    if (name === "current-tab") {
      this.currentTabIndex = parseInt(newValue) || 0;
      this.updateCurrentTab();
    }

    if (name === "hide-class") {
      this.hideClass = newValue || "hidden";
      this.updateCurrentTab();
    }
  }

  protected render(): void {
    super.render({
      template: templateContent,
      componentName: "tabs-component",
      moduleUrl: import.meta.url,
    } as RenderOptions);
  }

  private setupTabs(): void {
    const slottedElements = this.querySelectorAll('[slot^="tab-"]');
    this.tabs = [];

    slottedElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      const slotName = htmlElement.getAttribute("slot") || "";
      const tabIndex = parseInt(slotName.replace("tab-", "")) || index;

      const tabData: TabData = {
        label: htmlElement.dataset.label || `Tab ${tabIndex + 1}`,
        id: `tab-${tabIndex}`,
        icon: htmlElement.dataset.icon,
        isVisible: htmlElement.dataset.visible !== "false",
        element: htmlElement,
      };

      this.tabs[tabIndex] = tabData;
    });

    // Filter out undefined entries and ensure we have a contiguous array
    this.tabs = this.tabs.filter((tab) => tab !== undefined);
    this.renderTabList();
    this.renderTabPanels();
  }

  private renderTabList(): void {
    const tabList = this.shadow.querySelector(s("list"));
    if (!tabList) return;

    tabList.innerHTML = "";

    this.tabs.forEach((tab, index) => {
      if (!tab.isVisible) return;

      const listItem = document.createElement("li");
      listItem.className = s("list-item").slice(1); // remove dot for className
      listItem.setAttribute("role", "presentation");

      const button = document.createElement("button");
      button.className = s("button").slice(1);

      const buttonAttributes: Record<string, string> = {
        type: "button",
        role: "tab",
        id: `${tab.id}-tab`,
        "aria-controls": tab.id,
        "aria-selected": (index === this.currentTabIndex).toString(),
        tabindex: index === this.currentTabIndex ? "0" : "-1",
      };

      Object.entries(buttonAttributes).forEach(([key, value]) => {
        button.setAttribute(key, value);
      });

      if (tab.icon) {
        const iconSpan = document.createElement("span");
        iconSpan.className = s("icon").slice(1);
        iconSpan.innerHTML = tab.icon;
        button.appendChild(iconSpan);
      }

      const labelSpan = document.createElement("span");
      labelSpan.className = s("label").slice(1);
      labelSpan.textContent = tab.label;
      button.appendChild(labelSpan);

      listItem.appendChild(button);
      tabList.appendChild(listItem);
    });
  }

  private renderTabPanels(): void {
    const tabPanels = this.shadow.querySelector(s("panels"));
    if (!tabPanels) return;

    tabPanels.innerHTML = "";

    this.tabs.forEach((tab, index) => {
      const panel = document.createElement("div");
      panel.className = s("panel").slice(1);

      Object.entries({
        role: "tabpanel",
        id: tab.id,
        "aria-labelledby": `${tab.id}-tab`,
        tabindex: "0",
      }).forEach(([key, value]) => {
        panel.setAttribute(key, value);
      });

      const slot = document.createElement("slot");
      slot.setAttribute("name", `tab-${index}`);
      panel.appendChild(slot);

      tabPanels.appendChild(panel);
    });
  }

  private addEventListeners(): void {
    this.shadow.addEventListener("click", this.handleTabClick.bind(this));
    this.shadow.addEventListener("keydown", (event: Event) => {
      this.handleKeyDown(event as KeyboardEvent);
    });
  }

  private handleTabClick(event: Event): void {
    const target = event.target as HTMLElement;
    const button = target.closest(s("button")) as HTMLButtonElement;

    if (!button) return;

    const tabId = button.getAttribute("aria-controls");
    const tabIndex = this.tabs.findIndex((tab) => tab.id === tabId);

    if (tabIndex !== -1) {
      this.setCurrentTab(tabIndex);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains(s("button").slice(1))) return;

    const visibleTabs = this.tabs.filter((tab) => tab.isVisible);
    const currentVisibleIndex = visibleTabs.findIndex(
      (tab) => tab.id === target.getAttribute("aria-controls")
    );

    let newIndex = currentVisibleIndex;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        newIndex =
          currentVisibleIndex > 0
            ? currentVisibleIndex - 1
            : visibleTabs.length - 1;
        break;
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        newIndex =
          currentVisibleIndex < visibleTabs.length - 1
            ? currentVisibleIndex + 1
            : 0;
        break;
      case "Home":
        event.preventDefault();
        newIndex = 0;
        break;
      case "End":
        event.preventDefault();
        newIndex = visibleTabs.length - 1;
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        const tabIndex = this.tabs.findIndex(
          (tab) => tab.id === target.getAttribute("aria-controls")
        );
        if (tabIndex !== -1) {
          this.setCurrentTab(tabIndex);
        }
        return;
    }

    if (newIndex !== currentVisibleIndex) {
      const actualTabIndex = this.tabs.findIndex(
        (tab) => tab.id === visibleTabs[newIndex].id
      );
      const newButton = this.shadow.querySelector(
        `#${visibleTabs[newIndex].id}-tab`
      ) as HTMLButtonElement;
      if (newButton) {
        newButton.focus();
      }
    }
  }

  private setCurrentTab(index: number): void {
    if (index < 0 || index >= this.tabs.length || !this.tabs[index].isVisible)
      return;

    const oldIndex = this.currentTabIndex;
    this.currentTabIndex = index;

    this.setAttribute("current-tab", index.toString());
    this.updateCurrentTab();

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("x-tabs:change", {
        detail: {
          previousIndex: oldIndex,
          currentIndex: index,
          currentTab: this.tabs[index],
        },
        bubbles: true,
      })
    );
  }

  private updateCurrentTab(): void {
    // Update tab buttons
    const buttons = this.shadow.querySelectorAll(s("button"));
    buttons.forEach((button, index) => {
      const isSelected = index === this.currentTabIndex;
      button.setAttribute("aria-selected", isSelected.toString());
      button.setAttribute("tabindex", isSelected ? "0" : "-1");

      if (isSelected) {
        button.classList.add(s("button", true).slice(1)); // "--active" modifier
      } else {
        button.classList.remove(s("button", true).slice(1));
      }
    });

    // Update tab panels
    const panels = this.shadow.querySelectorAll(s("panel"));
    panels.forEach((panel, index) => {
      if (index === this.currentTabIndex) {
        panel.classList.remove(this.hideClass);
        panel.removeAttribute("hidden");
      } else {
        panel.classList.add(this.hideClass);
        panel.setAttribute("hidden", "");
      }
    });
  }

  // Public API methods
  public getCurrentTab(): number {
    return this.currentTabIndex;
  }

  public getTabCount(): number {
    return this.tabs.filter((tab) => tab.isVisible).length;
  }

  public switchToTab(index: number): void {
    this.setCurrentTab(index);
  }
}

customElements.define("x-tabs", TabsComponent);
