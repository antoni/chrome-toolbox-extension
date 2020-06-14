// ["https://allegro.pl/*"]

// https://allegro.pl/listing (Allegro search)

// Order by (price with delivery costs) ASC
const orderByPriceWithDeliveryQueryParam = 'order=d'

if (window.location.href.indexOf("listing") !== -1
  && window.location.href.indexOf(orderByPriceWithDeliveryQueryParam) === -1) {
  const regex = /order=[a-z]{1,2}/i
  const newLocationHref = window.location.href.replace(regex, orderByPriceWithDeliveryQueryParam)

  window.location.href = newLocationHref
}