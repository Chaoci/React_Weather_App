import React,{useState, useEffect, useMemo} from 'react';
import 'normalize.css';
import { getMoment, findLocation } from './utils/helper';
import styled from '@emotion/styled'
import { ThemeProvider } from '@emotion/react';
// import dayjs from 'dayjs';
import WeatherCard from './views/weatherCard.js';
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherSetting from './views/weaterSetting';


const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;



const AUTHORIZATION_KEY = 'CWB-5709870E-4DA0-4FBE-9AD1-89255D8A9788';


function App() {

  // const storageCity = localStorage.getItem('cityName') || '臺中市';

  const [currentCity, setCurrentCity] = useState(()=>localStorage.getItem('cityName')||'臺中市');

  //修改地區名稱
  const currentLocation = useMemo(()=>findLocation(currentCity),[currentCity]);
  const {cityName, locationName, sunriseCityName} = currentLocation;
  const handleCurrentCityChange = (currentCity)=>{
    setCurrentCity(currentCity);
  };

  const moment = useMemo(()=>getMoment(sunriseCityName),[sunriseCityName]);
  const [currentWeather, fetchData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY,
    locationName,
    cityName,
  })
  //利用useEffect來改變因為moment改變來調整主題
  useEffect(()=>{
    setCurrentTheme(moment === 'day' ? 'light':'dark');
  },[moment]);


  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  
  const handleCurrentPage = (currentPage)=>{
    setCurrentPage(currentPage);
  };

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard 
            currentWeather={currentWeather}
            cityName={cityName}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPage={handleCurrentPage}
          />
          )}
        {currentPage === 'WeatherSetting' && (<WeatherSetting cityName={cityName}handleCurrentPage={handleCurrentPage} handleCurrentCityChange={handleCurrentCityChange}/>)}
      </Container>
    </ThemeProvider>
  );
}

export default App;
