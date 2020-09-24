import React from 'react';
import logo from './logo.svg';
import './App.css';
import useSWR, {SWRConfig} from 'swr';


const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App() {
  let dataUrl = "https://data.police.uk/api/metropolitan/neighbourhoods";
  // dataUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=51.4415&lng=0.0117&date=2020-09";
  const {data, error} = useSWR(dataUrl, fetcher);
  
  console.log(data, error);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

