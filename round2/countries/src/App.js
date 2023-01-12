import { useState, useEffect } from 'react';
import axios from 'axios';

const CountryDetails = ({country}) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      <p>capital: {country.capital[0]}</p>
      <p>area: {country.area}</p>

      <b>languages:</b>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      {country.flags.png && <img src={country.flags.png} />}
    </>
  )
}

const CountryListing = ({country, onClickShow}) => {
  return (<li>{country.name.common}<button onClick={onClickShow}>Show</button></li>)
}

function App() {

  const [searchText, setSearchText] = useState('');
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      if (!response || !response.data) {
        console.log('some error')
        return;
      }
      setCountryData(response.data)
    })
  }, [])

  let filteredCountries = []
  if (countryData) {
    filteredCountries = countryData.filter(country => {
      return country.name.common.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
    })
  }

  let countryDisplay;
  if (filteredCountries.length > 10) {
    countryDisplay = 'Too many matches, specify another filter';
  } else if (filteredCountries.length === 1) {
    countryDisplay = <CountryDetails country={filteredCountries[0]} />;
  } else {
    countryDisplay = (<ul>
    {filteredCountries.map(country =>
      <CountryListing
        key={country.name.common}
        country={country}
        onClickShow={() => setSearchText(country.name.common)}
      />
    )}
    </ul>)
  }
  return (<div>
    find countries
    <input onChange={e => setSearchText(e.target.value)} value={searchText}></input>
    <br/>
    {countryDisplay}
  </div>)
}

export default App;
