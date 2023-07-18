import React, {useState, useEffect} from 'react';
import './App.css';
import {Weather} from './weather';

// https://www.mongodb.com/docs/realm/sdk/node/integrations/electron-cra/

// npm start
// cls && npm run build && copy APIKEY.json build
// add-on figma

// todo Do a little popup showing another informations about AirQuality
// todo Do a switch to UK Defra in AirQuality, as celcus to fahrengeit
// todo Create a task to auto start and run build commands 

function App() {
    const [weatherData, setWeatherData] = useState('');
    const [temp, setTemp] = useState('');
    const [feelsLike, setFeelsLike] = useState('');
    const [typeTemp, setTypeTemp] = useState("C");
    const [loading, setLoading] = useState(true); // semaphore to run initDatas() after getWeather receve API response
    const [airQuality, setAirQuality] = useState('');
    const [typeAirQuality, setTypeAirQuality] = useState("US_EPA");
    const [showSubAirType, setShowSubAirType] = useState(false);
    const [subAirTypes, setSubAirTypes] = useState('');

    async function getWeather(){
        let weather = new Weather();
        const response = await weather.forecastJSON();
        setWeatherData(response);
        setLoading(false); // semaphore to run initDatas() after getWeather receve API response
    }

    function switchTypeTemp(){
        if(typeTemp === "C"){
            setTemp(weatherData?.current?.temp_f + "°F"); // this "?" serve to return undefined if has nothing
            setFeelsLike(weatherData?.current?.feelslike_f + "°F");
            setTypeTemp("F");
        }
        else{
            setTemp(weatherData?.current?.temp_c + "°C");
            setFeelsLike(weatherData?.current?.feelslike_c + "°C");
            setTypeTemp("C");
        }
    }
    
    async function initDatas(){
        if(typeTemp === "C"){
            setTemp(weatherData?.current?.temp_c + "°C");
            setFeelsLike(weatherData?.current?.feelslike_c + "°C");
        }else{
            setTemp(weatherData?.current?.temp_f + "°F");
            setFeelsLike(weatherData?.current?.feelslike_f + "°F");
        }
        if(typeAirQuality === "US_EPA"){
            setAirQuality(weatherData?.current?.air_quality["us-epa-index"]);
            setSubAirTypes(
            <ul className='ListAirQuality'>
                <li className='ListAirQuality'>1 means Good</li>
                <li className='ListAirQuality'>2 means Moderate</li>
                <li className='ListAirQuality'>3 means Unhealthy for sensitive group</li>
                <li className='ListAirQuality'>4 means Unhealthy</li>
                <li className='ListAirQuality'>5 means Very Unhealthy</li>
                <li className='ListAirQuality'>6 means Hazardous</li>
            </ul>
        );
        }else{
            setAirQuality(weatherData?.current?.air_quality["gb-defra-index"]);
            setSubAirTypes(
                <ul className='ListAirQuality'>
                    <li className='ListAirQuality'>1 - Low</li>
                    <li className='ListAirQuality'>2 - Low</li>
                    <li className='ListAirQuality'>3 - Low</li>
                    <li className='ListAirQuality'>4 - Moderate</li>
                    <li className='ListAirQuality'>5 - Moderate</li>
                    <li className='ListAirQuality'>6 - Moderate</li>
                    <li className='ListAirQuality'>7 - High</li>
                    <li className='ListAirQuality'>8 - High</li>
                    <li className='ListAirQuality'>9 - High</li>
                    <li className='ListAirQuality'>10 - Very High</li>
                </ul>
            );
        }
    }

    function statusAirColor(){
        if(weatherData?.current?.air_quality["us-epa-index"] === 1){
            return 'green'
        }
        if(weatherData?.current?.air_quality["us-epa-index"] === 2){
            return 'yellow'
        }
        if(weatherData?.current?.air_quality["us-epa-index"] === 3){
            return 'orange'
        }
        if(weatherData?.current?.air_quality["us-epa-index"] >= 4){
            return 'red'
        }
    }

    function switchAirType(){
        if(typeAirQuality === "US_EPA"){
            setAirQuality(weatherData?.current?.air_quality["gb-defra-index"]);
            setSubAirTypes(
                <ul className='ListAirQuality'>
                    <li className='ListAirQuality'>1 - Low</li>
                    <li className='ListAirQuality'>2 - Low</li>
                    <li className='ListAirQuality'>3 - Low</li>
                    <li className='ListAirQuality'>4 - Moderate</li>
                    <li className='ListAirQuality'>5 - Moderate</li>
                    <li className='ListAirQuality'>6 - Moderate</li>
                    <li className='ListAirQuality'>7 - High</li>
                    <li className='ListAirQuality'>8 - High</li>
                    <li className='ListAirQuality'>9 - High</li>
                    <li className='ListAirQuality'>10 - Very High</li>
                </ul>
            );
            setTypeAirQuality("UK_DEGRA");
        }
        else{
            setAirQuality(weatherData?.current?.air_quality["us-epa-index"]);
            setSubAirTypes(
                <ul className='ListAirQuality'>
                    <li className='ListAirQuality'>1 means Good</li>
                    <li className='ListAirQuality'>2 means Moderate</li>
                    <li className='ListAirQuality'>3 means Unhealthy for sensitive group</li>
                    <li className='ListAirQuality'>4 means Unhealthy</li>
                    <li className='ListAirQuality'>5 means Very Unhealthy</li>
                    <li className='ListAirQuality'>6 means Hazardous</li>
                </ul>
            );
            setTypeAirQuality("US_EPA");
        }
    }

    // Calling initial functions
    useEffect(() => { // useEffect avoid repeat several times
        getWeather();
    }, [])

    useEffect(() => { 
        if(!loading){ // semaphore to run initDatas() after getWeather receve API response
            initDatas();
        }
    }, [loading]); // if I have to use some external object in useEffect use dependence of useEffect
    
    // as can see in popup airType when set some variable use arrow function to avoid error
    return (
        <div className='main'>
            <div className='head'>
                <p>{weatherData?.location?.name} - {weatherData?.location?.region}</p>
                <p className='temp' onClick={switchTypeTemp}>{temp}</p>
                <p className='feelslike' onClick={switchTypeTemp}>Feels Like: {feelsLike}</p>
            </div>
            <div className='detail'>
                <div className='airQuality'>
                    <p>Air Quality</p>
                    <div className='statusAirDiv' onMouseEnter={() => setShowSubAirType(true)} onMouseLeave={() => setShowSubAirType(false)}>
                        <div className='statusAirIcon' style={{backgroundColor: statusAirColor()}}></div>
                        <p style={{margin: 0, marginLeft: '10px'}} onClick={switchAirType}>{airQuality}</p>
                        {showSubAirType && (
                            <div className='popup-AirQuality'>
                                <div>
                                    {subAirTypes}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='wind'>
                    <p>Wind</p>
                </div>
            </div>
        </div>
    );
}

export default App;
