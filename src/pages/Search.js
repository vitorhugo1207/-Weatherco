import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import "../css/Search.css";
import { Weather } from "../API/weather";
import Select from 'react-select';


// todo Make a style to Search box
// todo Make a autocomplite (https://react.dev/reference/react-dom/components/input)
// todo Make a button arrow style
// todo Make a enter press key event

const Search = () =>{
    const [cityResp, setCityResp] = useState('');
    const [search, setSearch] = useState([]);
    const navegate = useNavigate();

    const getCityResp = (inputValue) => {
        const weather = new Weather(inputValue);
        const response = weather.getCity();
        response.then(response => {
            const newOption = [];
            for(let x = 0; x < response.length; x++){
                newOption.push({value: `${response[x]?.name}-${response[x]?.region}`, label:`${response[x]?.name}, ${response[x]?.region}`});
            }
            setSearch(newOption);
        });
    }

    const navegateToHome = (inputValue) => {
        const value = inputValue.value;
        navegate('/', {state:{cityFromSearch: value}});
    }

    return(
        <div>
            <Link to='/'>Home</Link>

            <Select
                placeholder='Type the name city'
                options={search}
                onInputChange={getCityResp}
                autoFocus={true}
                onChange={navegateToHome}
                classNamePrefix="react-select"
            />
        </div>
    )
}

export default Search;
