// ["https://online.mbank.pl/*"]

// Hide all security notifications
Array.from(document.getElementsByClassName("icon-close")).forEach(element => {
  (element as HTMLButtonElement).click()
});

const hideHtmlElement = (htmlElement: HTMLElement) => {
  if (htmlElement) {
    htmlElement.style.visibility = "hidden";
    htmlElement.hidden = true;
  }
}

const hideHtmlElementById = (htmlElementId: string) => {
  console.debug("Trying to find HTML element with ID: ", htmlElementId)
  const htmlElement = document.getElementById(htmlElementId) as HTMLElement
  hideHtmlElement(htmlElement)
}

const hideHtmlElementsByName = (htmlElementName: string) => {
  Array.from(document.getElementsByName(htmlElementName))
    .forEach(element => hideHtmlElement(element as HTMLElement));
}

const hideHtmlElementsByClassName = (htmlElementName: string) => {
  Array.from(document.getElementsByClassName(htmlElementName))
    .forEach(element => hideHtmlElement(element as HTMLElement));
}

// Hide all account balances
const hideAllBalances = () => {
  ["currentAccBalance", "account-list-summary"].forEach(hideHtmlElementById);
  ["fromAccount"].forEach(hideHtmlElementsByName);
  ["bars"].forEach(hideHtmlElementsByClassName);

  Array.from(document.getElementsByClassName("balance")).forEach(element => {
    (element as HTMLElement).hidden = true;
  });
}

// Ugly hack to overcome all the DOM mutations
// (MutationObserver did not work here)
setTimeout(hideAllBalances, 700)
setTimeout(hideAllBalances, 1700)