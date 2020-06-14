// ["https://online.enel.pl/*"]

// https://online.enel.pl/Account/Login
const termsCheckbox = document.getElementById('IsAcceptedRule') as HTMLInputElement
if (termsCheckbox) { // Login page
  termsCheckbox.checked = true

  const submitLoginAnchor = document.getElementsByClassName("btn btn-primary btn-lg js-trigger-to-submit")[0] as HTMLAnchorElement

  const loginInput = document.getElementById("Login") as HTMLInputElement

  // Add some delay to let LastPass fill in username and password
  setTimeout(() => {
    console.log("Click!")
    if ((document.getElementById("Login") as HTMLInputElement).value !== "") {
      submitLoginAnchor.click()
    }
  }, 300);
}

// https://online.enel.pl/
const privacyPolicyCloseButton = document.getElementsByClassName('ti-close')[0] as HTMLElement
if (privacyPolicyCloseButton) { // Privacy policy close button
  privacyPolicyCloseButton.click()
}

// https://online.enel.pl/Visit/New
const targetNode = document.getElementsByClassName('container')[0] as HTMLElement;
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(() => {
  const acceptVisitTermsCheckbox = document.getElementById('AcptRul') as HTMLInputElement
  if (acceptVisitTermsCheckbox) { // Visit search form
    acceptVisitTermsCheckbox.checked = true
  }

  const acceptVisitTermsCheckbox2 = document.getElementById('AcceptedRules') as HTMLInputElement
  if (acceptVisitTermsCheckbox2) { // Visit confirmation modal
    acceptVisitTermsCheckbox2.checked = true
  }
});

observer.observe(targetNode, config)