import React from 'react';
import './App.css';
import useSWR, {SWRConfig} from 'swr';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App() {
  return <SWRConfig value={{fetcher}}>
    <Crimes />
  </SWRConfig>
}

function Crimes(){
  let dataUrl = "https://data.police.uk/api/metropolitan/neighbourhoods";
  const lat = 51.464200;
  const lng = -0.014957;
  let date = new Date();
  let twoDigitMonth = ("0" + (new Date(date.getMonth() - 3).getMonth() + 1)).slice(-2);
  //lng and lat for Lewisham below
  // dataUrl = "https://data.police.uk/api/crimes-street/all-crime?lat=51.4415&lng=0.0117&date=2020-09";
  dataUrl = `https://data.police.uk/api/stops-street?lat=${lat}&lng=${lng}&date=${date.getFullYear()}-${twoDigitMonth}`;
  const {data, error} = useSWR(dataUrl);
  
  if(error){
    return <div>Error...</div>;
  }

  if(!data){
    return <div>Loading..</div>;
  }
  console.log(data, error);

  //it is interesting
  //map is doing an extraction of a data
  //we cast array that is a result of filtering to a Set to have a unique values (distinct)
  //with ... operator we cast set to array
  return <DisplayCrimes 
     crimes={data}
     ethnicities={[...new Set(data.filter(crime => crime.self_defined_ethnicity != null).map(crime=> crime.self_defined_ethnicity))]}/>;
}

function DisplayCrimes({crimes, ethnicities}){
  const [filterEthnicity, setFilterEthnicity] = React.useState(null);

  const filterCrimes = filterEthnicity ? crimes.filter(crime => crime.self_defined_ethnicity === filterEthnicity) : crimes;

  return(
    <>
    {ethnicities.map(ethnicity => (
      <Button size="small" variant="contained" color="primary"
          onClick={() => setFilterEthnicity(ethnicity)}
          key={ethnicity}>{ethnicity}</Button>
    ))}
    {filterEthnicity && <Button startIcon={<RestoreIcon/>} size="small" color="secondary" variant="contained" onClick={() => {
      setFilterEthnicity(null);
    }}>reset</Button>}
      <pre>{JSON.stringify(filterCrimes, null, 2)}</pre>
    </>
  );
}