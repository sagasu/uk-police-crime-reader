import React from 'react';
import './App.css';
import useSWR, {SWRConfig} from 'swr';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';
import FilterIcon from '@material-ui/icons/Filter1';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { ButtonGroup } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function App() {
  return <SWRConfig value={{fetcher}}>
    <Crimes />
  </SWRConfig>
}

function Crimes(){
  let [lat, setLat] = React.useState(51.464200);
  let [lng, setLng] = React.useState(-0.014957);

  let dataUrl = "https://data.police.uk/api/metropolitan/neighbourhoods";
  // let lat = 51.464200;
  // let lng = -0.014957;
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
     position={[lat, setLat, lng, setLng]}
     crimes={data}
     ethnicities={[...new Set(data.filter(crime => crime.officer_defined_ethnicity != null).map(crime=> crime.officer_defined_ethnicity))]}/>;
}

function DisplayCrimes({position, crimes, ethnicities}){
  const [filterEthnicity, setFilterEthnicity] = React.useState(null);

  const filterCrimes = filterEthnicity ? crimes.filter(crime => crime.officer_defined_ethnicity === filterEthnicity) : crimes;

  return(
    <>
    <List>
      <ListItem>
        <TextField value={position[0]} onChange={(event) => position[1](event.target.value)} label="latitude" type="number"></TextField>
        <TextField value={position[2]} onChange={(event) => position[3](event.target.value)} label="longitude" type="number"></TextField>
      </ListItem>

      <ListItem>
        <ButtonGroup>
          {ethnicities.map(ethnicity => (

              <Button endIcon={<FilterIcon />} size="small" variant="contained" color="primary"
                  onClick={() => setFilterEthnicity(ethnicity)}
                  key={ethnicity}>{ethnicity}</Button>
          ))}
        
          {filterEthnicity && <Button startIcon={<RestoreIcon/>} size="small" color="secondary" variant="contained" onClick={() => {
            setFilterEthnicity(null);
          }}>reset</Button>}
        </ButtonGroup>
      </ListItem>
    </List>
      <pre>{JSON.stringify(filterCrimes, null, 2)}</pre>
    </>
  );
}