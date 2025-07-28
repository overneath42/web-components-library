export function prependCSS(url: string, target: DocumentFragment): void {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", url);
  target.prepend(link);
}
