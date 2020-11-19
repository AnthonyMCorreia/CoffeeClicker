/* eslint-disable no-alert */
//NOTE: Commit more often. Commiting and pushing to github often will 
//save you if an accident happens and you lose all your work in your local repository
//When the solution becomes available, Look it over there is a few places that you can steamline your code, if you want.

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffeeCount = document.getElementById('coffee_counter');
  coffeeCount.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach((producer) => {
    if (coffeeCount >= producer.price / 2) {
      producer.unlocked = true;
    }
  });
}

function getUnlockedProducers(data) {
  return data.producers.filter((producer) => producer.unlocked);
}

function makeDisplayNameFromId(id) {
  const newId = id
    .split('_')
    .map((word) => {
      return (
        word.substring(0, 1).toUpperCase() + word.substring(1, word.length)
      );
    })
    .join(' ');

  id = newId;
  return newId;
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  const parentChildrenArr = Array.from(parent.childNodes);

  parentChildrenArr.forEach((child) => {
    parent.removeChild(child);
  });
}

function renderProducers(data) {
  unlockProducers(data.producers, data.coffee);

  const divContainer = document.querySelector('#producer_container');
  deleteAllChildNodes(divContainer);
  const producers = getUnlockedProducers(data);

  producers.forEach((producer) => {
    divContainer.appendChild(makeProducerDiv(producer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  return data.producers.find((producer) => producer.id === producerId);
}

function canAffordProducer(data, producerId) {
  const producer = getProducerById(data, producerId);

  return data.coffee >= producer.price ? true : false;
}

function updateCPSView(cps) {
  const cpsElm = document.getElementById('cps');
  cpsElm.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  const canAfford = canAffordProducer(data, producerId);

  if (canAfford) {
    const producer = getProducerById(data, producerId);
    const newPrice = updatePrice(producer.price);

    data.coffee -= producer.price;
    producer.qty += 1;
    producer.price = newPrice;
    data.totalCPS += producer.cps;

    updateCoffeeView(data.coffee);
    updateCPSView(data.totalCPS);
    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  if (event.target.tagName === 'BUTTON') {
    const minusBuy = event.target.id.substring(4, event.target.id.length);
    if (canAffordProducer(data, minusBuy)) {
      attemptToBuyProducer(data, minusBuy);
      renderProducers(data);
    } else {
      window.alert('Not enough coffee!');
    }
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', (event) => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick,
  };
}
