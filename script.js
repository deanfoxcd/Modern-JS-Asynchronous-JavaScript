'use strict';

const APIURL = 'https://restcountries.com/v3.1/name/portugal';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// XML http Request (old way)
/*
const getCountryData = function (country) {
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
        <article class="country">
          <img class="country__img" src="${data.flags.png}" />
            <div class="country__data">
                <h3 class="country__name">${data.name.official}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(
                  +data.population / 1000000
                ).toFixed(1)} million people</p>
                <p class="country__row"><span>🗣️</span>${
                  Object.values(data.languages)[0]
                }</p>
                <p class="country__row"><span>💰</span>${
                  Object.values(data.currencies)[0].name
                }</p>
            </div>
        </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('portugal');
getCountryData('south africa');
getCountryData('usa');
*/

// Callback Hell (nested callbacks)

const renderCountry = function (data, className = '') {
  const html = `
          <article class="country ${className}">
            <img class="country__img" src="${data.flags.png}" />
              <div class="country__data">
                  <h3 class="country__name">${data.name.official}</h3>
                  <h4 class="country__region">${data.region}</h4>
                  <p class="country__row"><span>👫</span>${(
                    +data.population / 1000000
                  ).toFixed(1)} million people</p>
                  <p class="country__row"><span>🗣️</span>${
                    Object.values(data.languages)[0]
                  }</p>
                  <p class="country__row"><span>💰</span>${
                    Object.values(data.currencies)[0].name
                  }</p>
              </div>
          </article>`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  //   countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  //   countriesContainer.style.opacity = 1;
};

const getCountryAndNeighbour = function (country) {
  // AJAX call country 1
  const request = new XMLHttpRequest();

  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);
    // Render country 1
    renderCountry(data);

    // Get neighbour
    const neighbour = data.borders?.[0];

    // Second AJAX Call
    const request2 = new XMLHttpRequest();
    const getCountryData = function () {};

    request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function () {
      const [data2] = JSON.parse(this.responseText);
      console.log(data2);
      // Render country 1
      renderCountry(data2, 'neighbour');
    });
  });
};

// getCountryAndNeighbour('portugal');
// getCountryAndNeighbour('usa');

// Consuming Promises

const request = fetch('https://restcountries.com/v3.1/name/portugal');
// console.log(request);

// const getCountryDataP = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(function (response) {
//       console.log(response);
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//       renderCountry(data[0]);
//     });
// };

// Refactored and added neighbour country

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

// const getCountryDataP = function (country) {
//   fetch(`https://restcountries.com/v3.1/name/${country}`)
//     .then(response => {
//       if (!response.ok)
//         throw new Error(`Country not found (${response.status})`); // Catch doesn't catch 404
//       return response.json();
//     })
//     .then(data => {
//       renderCountry(data[0]);
//       const neighbourCountry = data[0].borders?.[0];
//       return fetch(`https://restcountries.com/v3.1/alpha/${neighbourCountry}`);
//       // .then(nResponse => nResponse.json())
//       // .then(nData => renderCountry(nData[0], 'neighbour'));
//       // ^^ back to callback hell
//     })
//     .then(response => response.json())
//     .then(data => renderCountry(data[0], 'neighbour'))
//     .catch(err => {
//       console.error(`${err} 🚨🚨🚨`);
//       renderError(`Something went wrong 🚨 ${err.message}`);
//     })
//     .finally(() => {
//       countriesContainer.style.opacity = 1;
//     }); // finally is always called no matter the result of the promise
// };

const getCountryDataP = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then(data => {
      renderCountry(data[0]);
      const neighbourCountry = data[0].borders?.[0];
      return getJSON(
        `https://restcountries.com/v3.1/alpha/${neighbourCountry}`,
        'No neighbour found'
      );
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      renderError(`Something went wrong 🚨 ${err.message}`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', () => getCountryDataP('australia'));
// getCountryDataP('fdhjk');
