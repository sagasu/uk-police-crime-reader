import React from 'react';
import './App.css';
import useSWR, {SWRConfig} from 'swr';


const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App() {
  let dataUrl = "https://data.police.uk/api/metropolitan/neighbourhoods";
  const lat = 51.464200;
  const lng = -0.014957;
  let date = new Date();
  let twoDigitMonth = ("0" + (new Date(date.getMonth() - 3).getMonth() + 1)).slice(-2);
  //lng and lat for Lewisham below
  // dataUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=51.4415&lng=0.0117&date=2020-09";
  dataUrl = `https://data.police.uk/api/stops-street?lat=${lat}&lng=${lng}&date=${date.getFullYear()}-${twoDigitMonth}`;
  const {data, error} = useSWR(dataUrl, fetcher);
  
  if(error){
    return <div>Error...</div>;
  }

  if(!data){
    return <div>Loading..</div>;
  }
  console.log(data, error);

  return<pre>{JSON.stringify(data, null, 2)}</pre>;

}

