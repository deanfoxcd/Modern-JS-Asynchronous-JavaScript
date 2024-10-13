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
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
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

// btn.addEventListener('click', () => getCountryDataP('australia'));
// getCountryDataP('fdhjk');

// **CODING CHALLENGE #1**
/*
const whereAmI = function (lat, lng) {
  const revUrl = `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

  // // From scratch
  //   fetch(revUrl)
  //     .then(response => {
  //       if (!response.ok)
  //         throw new Error(`Co-ordinates not found (${response.status})`);
  //       return response.json();
  //     })
  //     .then(data =>
  //       fetch(`https://restcountries.com/v3.1/name/${data.countryName}`)
  //     )
  //     .then(response => {
  //       if (!response.ok)
  //         throw new Error(`Country not found (${response.status})`);
  //       return response.json();
  //     })
  //     .then(data => renderCountry(data[0]))
  //     .finally(() => {
  //       countriesContainer.style.opacity = 1;
  //     });

//   // Using the functions created in the lessons above
  getJSON(revUrl, 'Co-ordinates not found')
    .then(data => getCountryDataP(data.countryName))
    .finally(() => (countriesContainer.style.opacity = 1));
};
whereAmI(-33.933, 18.474);
*/

// Building a Promise
/*

// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log('Lottery draw is happening now...');
//   setTimeout(() => {
//     if (Math.random() >= 0.5) resolve('You win!! 💸');
//     else reject(new Error('You lose 💩'));
//   }, 2000);
// });

// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err));


// Promisifying is the process of converting callback based behaviour to promise based behaviour

// Example:
const wait = function (seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

wait(5)
  .then(() => {
    console.log('5 seconds have passed');
    return wait(1);
  })
  .then(() => console.log('Waited another 1 second'));

// You could use the above to log a timer for example
*/

// Example 2:
/*
// navigator.geolocation.getCurrentPosition(
//   position => console.log(position),
//   err => console.error(err)
// );

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject); // Shorter
  });
};

// getPosition().then(res => console.log(res.coords.latitude));

const whereAmI = function (lat, lng) {
  //   const revUrl = `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;

  getPosition()
    .then(pos => {
      console.log(pos.coords);
      const { latitude: lat, longitude: lng } = pos.coords;
      console.log(lat, lng);

      return fetch(
        `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
      );
    })

    .then(response => {
      if (!response.ok)
        throw new Error(`Co-ordinates not found (${response.status})`);
      return response.json();
    })
    .then(data =>
      fetch(`https://restcountries.com/v3.1/alpha/${data.countryCode}`)
    )
    .then(response => {
      if (!response.ok)
        throw new Error(`Country not found (${response.status})`);
      return response.json();
    })
    .then(data => renderCountry(data[0]))
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// whereAmI(36, -83);
// 36.1332736 - 83.7025792;

btn.addEventListener('click', whereAmI);
*/

// ** CODING CHALLENGE #2 **
/*

const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const imgEl = document.createElement('img');
    imgEl.src = imgPath;
    imgEl.addEventListener('load', function () {
      imgContainer.append(imgEl);
      resolve(imgEl);
    });
    imgEl.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

const wait = function (seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-2.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 2 loaded');
    return wait(2);
  })
  .then(() => {
    currentImg.style.display = 'none';
    return createImage('img/img-3.jpg');
  })
  .then(img => {
    currentImg = img;
    console.log('Image 3 loaded');
  })
  .catch(err => console.error(err));
*/

// Consuming Promises with Async/Await
/*

// does away with massive chaining

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  try {
    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocoding
    const resGeo = await fetch(
      `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    );
    if (!resGeo.ok) throw new Error('Problem getting location data');

    const dataGeo = await resGeo.json();

    // Country data
    // fetch(`https://restcountries.com/v3.1/name/${country}`).then((res) => console.log(res))
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${dataGeo.countryCode}`
    );
    if (!resGeo.ok) throw new Error('Problem getting country data');

    const data = await res.json();

    renderCountry(data[0]);
    // console.log(dataGeo);

    return `You are in ${dataGeo.locality}, ${dataGeo.principalSubdivision}, ${dataGeo.countryName}`; // The return value becomes the fulfillment of the promise
  } catch (err) {
    console.error(err);
    renderError(`Something went wrong ${err}`);

    // Reject promise returned from async function if there's an error (otherwise undefined)
    throw err;
  }
};

// Returning values from async/await

// The old way
console.log('Getting location');
// whereAmI();
// Returning a value from async/await
// whereAmI()
//   .then(city => console.log(city))
//   .catch(err => console.error(`${err.message}`))
//   .finally(() => console.log('Finished getting location'));
// // console.log('FIRST');

// Using async/await
(async function () {
  try {
    const city = await whereAmI();
    console.log(city);
  } catch (err) {
    console.error(`${err.message}`);
  }
  console.log('Finised getting location');
})();
*/

// Returning Promises in Parallel (for when the promises don't rely on each other)
/*

const get3Countries = async function (c1, c2, c3) {
  try {
    // In series
    // const [data1] = await getJSON(`https://restcountries.com/v3.1/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v3.1/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v3.1/name/${c3}`);

    // console.log([data1.capital[0], data2.capital[0], data3.capital[0]]);

    // In parallel (if one rejects, it all rejects)
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`),
    ]);

    // console.log(data);
    console.log(data.map(city => city[0].capital[0]));
  } catch (err) {
    console.error(err);
  }
};

get3Countries('south africa', 'united kingdom', 'mexico');
*/

// Other Promise Combinators (Race, Allsettled, Any)
/*

// Promise.race (first settled promise wins the race, fulfilled or rejected)
(async function () {
  const res = await Promise.race([
    getJSON(`https://restcountries.com/v3.1/name/italy`),
    getJSON(`https://restcountries.com/v3.1/name/spain`),
    getJSON(`https://restcountries.com/v3.1/name/canada`),
  ]);
  console.log(res[0]);
})();

// Set a custom timout time
const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long'));
    }, sec * 1000);
  });
};

Promise.race([getJSON(`https://restcountries.com/v3.1/name/egypt`), timeout(1)])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

// Promise.allSettled (creates an array of all settled promises no matter result. Doesn't shortcircuit)
Promise.allSettled([
  Promise.resolve('Resolved'),
  Promise.reject('Rejected'),
  Promise.resolve('Resolved'),
]).then(res => console.log(res));

// Promise.any (returns first fulfilled promise, ignores rejections)
Promise.any([
  Promise.resolve('Resolved'),
  Promise.reject('Rejected'),
  Promise.resolve('Resolved'),
]).then(res => console.log(res));
*/

// ** CODING CHALLENGE #3 **
/*

// Code from #2
const imgContainer = document.querySelector('.images');

const createImage = function (imgPath) {
  return new Promise(function (resolve, reject) {
    const imgEl = document.createElement('img');
    imgEl.src = imgPath;
    imgEl.addEventListener('load', function () {
      imgContainer.append(imgEl);
      resolve(imgEl);
    });
    imgEl.addEventListener('error', function () {
      reject(new Error('Image not found'));
    });
  });
};

const wait = function (seconds) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
};

const loadNPause = async function () {
  try {
    let img = await createImage('img/img-1.jpg');
    await wait(2);
    img.style.display = 'none';
    img = await createImage('img/img-2.jpg');
    await wait(2);
    img.style.display = 'none';
    img = await createImage('img/img-3.jpg');
    await wait(2);
  } catch (err) {
    console.error(err);
  }
};
// loadNPause();

const imgArray = ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg'];

const loadAll = async function (imgArr) {
  try {
    // My solution
    const imgs = await Promise.all(
      imgArr.map(async img => await createImage(img))
    );
    console.log(imgs);
    imgs.forEach(img => img.classList.add('parallel'));

    // Course Solution
    // const imgs = imgArr.map(async img => await createImage(img));
    // const imgEl = await Promise.all(imgs);
    // console.log(imgEl);
    // imgEl.forEach(img => img.classList.add('parallel'));
  } catch (err) {
    console.error(err);
  }
};
loadAll(imgArray);
*/
