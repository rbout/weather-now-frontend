'use client'
import Card from "@/app/components/card";
import {IconLocation, IconSunrise, IconSunset, IconSun, IconCloud} from "@tabler/icons-react";
import React,  {Suspense, useEffect, useState} from "react";
import WMO from "./JSON/wmo_codes.json"
import NewYorkIMG from "../../public/new_york.png"
import Image from "next/image";

const CurrentTemp = React.lazy(() =>
  getWeather().then((data) => {
    return {
      default: () => {
        return (
          <div>
            {Math.round(parseInt(data.current.temperature_2m))}
            <span className='text-3xl'>&deg;</span>
          </div>
        )
      }
    }
  })
);

const CurrentCondition = React.lazy(() =>
  getWeather().then((data) => {
    return {
      default: () => {
        const today = new Date(data.current.time)
        let isDay = today > new Date(data.daily.sunrise[0])
        let dayOrNight = 'night'
        if(isDay)
          dayOrNight = 'day'
        return (
          <p className='text-sm flex mt-1 items-center'>
            {WMO[data.current.weather_code][dayOrNight].description.toLowerCase().includes('sunny') && <IconSun size={16} className='mr-1'/>}
            {WMO[data.current.weather_code][dayOrNight].description.toLowerCase().includes('cloudy') && <IconCloud size={16} className='mr-1'/>}
            {WMO[data.current.weather_code][dayOrNight].description}
          </p>
        )
      }
    }
  })
);

const Sunrise = React.lazy(() =>
  getWeather().then((data) => {
    return {
      default: () => {
        return (
          <span>
            {new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </span>
        )
      }
    }
  })
)

const Sunset = React.lazy(() =>
  getWeather().then((data) => {
    return {
      default: () => {
        return (
          <span>
            {new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
          </span>
        )
      }
    }
  })
)

const MediumSkeletonLine = () => {
  return (
    <div className='bg-white/75 backdrop-filter backdrop-blur-md animate-pulse h-[24px] w-[70px] rounded-lg'></div>
  )
}

const LargeSkeletonSquare = () => {
  return (
    <div className='bg-white/75 backdrop-filter backdrop-blur-md animate-pulse h-[96px] w-[120px] rounded-lg'></div>
  )
}

const getWeather = async () => {
  const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=40.74911820836033&longitude=-73.98520608203322&current=temperature_2m,weather_code&hourly=temperature_2m&daily=sunrise,sunset&temperature_unit=fahrenheit&timezone=America%2FNew_York&models=gfs_seamless')

  if (!response.ok) {
    throw new Error("error");
  }

  return response.json()
}


export default function Home() {
  const initialState = {
    day: 0,
    month: '',
    sunrise: '',
    sunset: '',
    currentTemp: '',
    currentCondition: '',
    currentConditionImg: ''
  }

  const [state, setState] = useState(initialState);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=40.74911820836033&longitude=-73.98520608203322&current=temperature_2m,weather_code&hourly=temperature_2m&daily=sunrise,sunset&temperature_unit=fahrenheit&timezone=America%2FNew_York&models=gfs_seamless')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const today = new Date(data.current.time)
        let isDay = today > new Date(data.daily.sunrise[0])
        let dayOrNight = 'night'
        if(isDay)
          dayOrNight = 'day'
        setState({
          ...state,
          day: today.getDate(),
          month: today.toLocaleString('default', { month: 'short' }),
          sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          sunset: new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}),
          currentTemp: data.current.temperature_2m,
          currentCondition: WMO[data.current.weather_code][dayOrNight].description,
          currentConditionImg: WMO[data.current.weather_code][dayOrNight].image
        });
      })
  }, []);

  return (
    <div className='grid grid-cols-4 h-[100%]'>
      <div className='p-10'>
        <div className='grid grid-cols-3 mt-1'>
          <div className='col-span-2 flex items-center'>
            <IconLocation className='mr-1' size={12}/>
            New york, USA
          </div>
          <div className='flex items-center justify-end mt-1'>
            <IconSunrise className='mr-1' size={18}/>
            <Suspense fallback={
              <MediumSkeletonLine />
            }>
              <Sunrise />
            </Suspense>
          </div>
          <div className='col-span-2 flex items-center font-light text-sm'>
            Today {state.day} {state.month}
          </div>
          <div className='flex items-center justify-end mt-1'>
            <IconSunset className='mr-1' size={18}/>
            <Suspense fallback={
              <MediumSkeletonLine />
            }>
              <Sunset />
            </Suspense>
          </div>
        </div>
        <div className='flex flex-col text-8xl justify-center items-center mt-10'>
          <Suspense className='flex' fallback={
            <LargeSkeletonSquare />
          }>
            <CurrentTemp state={state} />
          </Suspense>
          <div className='mt-1'>
            <Suspense fallback={
              <MediumSkeletonLine />
            }>
              <CurrentCondition />
            </Suspense>
          </div>
        </div>
      </div>
      <div
        className='col-span-3 bg-white/80 h-[100%] rounded-l-3xl shadow-xl text-black p-10 backdrop-filter backdrop-blur-md'>
        <b>Welcome to your weather!</b>
        <br/>
        Check out today's weather information
        <Card>
          Hello world
        </Card>
      </div>
      <Image className='absolute -bottom-3 -left-3 pointer-events-none' src={NewYorkIMG} />
    </div>
  );
}
