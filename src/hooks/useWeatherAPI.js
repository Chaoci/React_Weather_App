import { useState, useEffect, useCallback } from "react";

const fetchWeatherForecast= ({authorizationKey, cityName})=>{
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
    )
    .then((response)=> response.json())
    .then((data)=>{
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) =>{
          if(['Wx','PoP','CI'].includes(item.elementName)){
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );
      // setCurrentWeather(
      //   (prevState)=>({
      //     ...prevState,
      return { 
          description: weatherElements.Wx.parameterName,
          weatherCode:weatherElements.Wx.parameterValue,
          locationName: locationData.locationName,
          rainPossibility: weatherElements.PoP.parameterName,
          comfortability: weatherElements.CI.parameterName,
      };
    });
};  

const fetchCurrentWeather =({authorizationKey, locationName})=>{
    // setCurrentWeather((prevState)=>({
    //   ...prevState,
    //   isLoading:true,
    // }));
  
  
    return fetch(
      `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`
    )
    .then((response)=>response.json())
    .then((data)=>{
      const locationData = data.records.location[0];
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP"].includes(item.elementName)){
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        }, {}
      );
      // setCurrentWeather((prevState)=>({
      //   ...prevState,
      return {
        observationTime:locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
        isLoading: false,
      };
    });
};

const useWeatherAPI = ({authorizationKey, locationName, cityName})=>{
    const [currentWeather, setCurrentWeather] = useState({
        observationTime: new Date(),
        locationName: "",
        description:"",
        windSpeed:0,
        temperature: 0,
        rainPossibility: 0,
        comfortability:'',
        weatherCode:0,
        isLoading: true,
    });

    const fetchData = useCallback(async()=>{
        setCurrentWeather((prevState)=>({
            ...prevState,
            isLoading:true,
        }));

        const [currentWeather, weatherForecast] = await Promise.all([fetchCurrentWeather({authorizationKey, locationName}),fetchWeatherForecast({authorizationKey, cityName})]);

        setCurrentWeather({
          ...currentWeather,
          ...weatherForecast,
          isLoading:false,
        })
      },[authorizationKey, locationName, cityName]);
      useEffect(()=>{
        // console.log("boom!")
        // setCurrentWeather((prevState)=>({
        //   ...prevState,
        //   isLoading:true,
        // }));
    
        fetchData();
      },[fetchData]);
    return [currentWeather, fetchData];
};

export default useWeatherAPI;