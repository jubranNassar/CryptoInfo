const id = document.querySelector("#blank");
const searchButton = document.querySelector("#searchbutton");
const cryptoInput = document.querySelector("#from-crypto");
const currencyOutput = document.querySelector("#to-fiat");
const amount = document.querySelector("#amount");
const convertButton = document.querySelector("#convert");
const resultsContainer = document.querySelector('#result-container');
const submit = document.querySelector("#submit");


function removeCrypto() {
  const removeCurrent = document.querySelector("#cryptocontainer");
  while (removeCurrent.lastChild) {
    removeCurrent.removeChild (removeCurrent.lastChild);
  }
}

// removes convert search
function removeConverted() {
  const removeContainer = document.querySelector("#convertcontainer");
  while (removeContainer.lastChild) {
    removeContainer.removeChild (removeContainer.lastChild);
  }
}
//gets list of all crypto
const allCrypto = async () => {
  const url = `https://api.coincap.io/v2/assets/`
  try {
    const result = await axios.get(url)
    let cryptoNames = result.data.data;
    let names = cryptoNames.map(item => {
      return item.name
    })
    id.addEventListener("input", (event => filterAndAppendResults(event, names)));
  } catch(error) { 
    console.error(error); 
  }
}

const removeResults = () => {
  resultsContainer.innerHTML = "";
  resultsContainer.classList.add("hidden");
} 

//filters dropdown list
const filterAndAppendResults = (event, names) => {
  const { value } = event.target;
  removeResults();
  if (!value) return;
  const filteredCrypto = names.filter((cryptoName) => {
    return cryptoName.toLowerCase().includes(value.toLowerCase());
  });

  filteredCrypto.forEach((cryptoName) => {
    const cryptoTag = document.createElement('p');
    cryptoTag.addEventListener("click", () => {
      id.value=cryptoName;
      removeResults();
      resultsContainer.innerHTML = "";
      
    })
    cryptoTag.innerText = cryptoName;
    resultsContainer.append(cryptoTag);
  });
  resultsContainer.classList.remove("hidden");
}
allCrypto();
removeResults();
//gets data about a specific crypto
const getData = async () => {
  try {
    const cryptoId = id.value.toLowerCase();
    const secondUrl = `https://api.coincap.io/v2/assets/${cryptoId}`;
    const response = await axios.get(secondUrl);
    console.log(response);
    displayContent(response);
  } catch (error) {
    console.error(error);
  }
  
}
//converts crypto into regular currency
const cryptoConvert = async () => {
  const currency = currencyOutput.value;
  const crypto = cryptoInput.value;
  const base_url = `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=${currency}`
  try {
    const result = await axios.get(base_url);
    let convertResult = result.data[crypto][currency];
    console.log(convertResult)

    // display content on the page
    removeConverted();
    const convertContainer = document.querySelector("#convertcontainer");
    const value = document.createElement("h1");
    const newVal = amount.value * result.data[crypto][currency];
    value.innerText = `${amount.value} ${crypto} = ${newVal} ${currency}`;
    convertContainer.appendChild(value);
  } catch(error) {
    console.error(error);
  }
}

// displays the content of a specific crypto on the page 
const displayContent = (response) => {
  removeCrypto();
  const cryptoContainer = document.querySelector("#cryptocontainer");

  const title = document.createElement("h1");
  title.innerText = response.data.data.name;
  cryptoContainer.appendChild(title);
  
  const symbol = document.createElement("h2");
  symbol.innerText = response.data.data.symbol;
  cryptoContainer.appendChild(symbol);

  const rank = document.createElement("h3");
  rank.innerText = response.data.data.rank;
  cryptoContainer.appendChild(rank);

  const priceUsd = document.createElement("h4");
  priceUsd.innerText = (response.data.data.priceUsd);
  cryptoContainer.appendChild(priceUsd);
}


convertButton.addEventListener("click", (event) => {
  event.preventDefault();
  cryptoConvert();
})




searchButton.addEventListener("click", (event)=> {
  event.preventDefault();
  getData();
})

submit.addEventListener("click", (event)=> event.preventDefault())