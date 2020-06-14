// ["https://kibana-elasticsearch.shared.nap.kreditech.systems/*", "https://kibana-ui.prod-nap.kreditech.systems/*"]

// Dismiss message shown on the top (they usually have no real value, just take screen space)
const hideDismissButton = () => {
  console.log("Clicking dismiss button!")
  const dismissButton = document.querySelector("#globalBannerList > div > div > div > div.euiText.euiText--small > button") as HTMLButtonElement
  if (dismissButton) {
    dismissButton.click()
  }
}

// TODO: Change to https://stackoverflow.com/a/44670818/963881
setTimeout(hideDismissButton, 10000)