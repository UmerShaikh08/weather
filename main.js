
// wait fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=${key}`)

const userWeather = document.querySelector("[data-yourWeather]");
const searchWeather = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector(".search-container");
const grantAccess = document.querySelector(".Grant-location-container");
const userInfo = document.querySelector(".user-info-container");
const loading = document.querySelector(".loading-container");
const notFound = document.querySelector(".not-found");



let key = "d1845658f92b31c64bd94f06f7188c9c";
let currentTab = userWeather;
currentTab.classList.add("current-tab")
getFromSessionStorage()

function switchTab(clickedTab) {
    if(clickedTab != currentTab){
        
        currentTab.classList.remove("current-tab")
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")
    
        if(!searchForm.classList.contains("active") ){
            notFound.classList.remove("active");
            userInfo.classList.remove("active");
            grantAccess.classList.remove("active");
            console.log("seach form")
            searchForm.classList.add("active");
        }
        else{
            notFound.classList.remove("active");
            searchForm.classList.remove("active");
            console.log("umer")
            userInfo.classList.remove("active")
            getFromSessionStorage();
        }
    }

}


userWeather.addEventListener("click" , () => {
        switchTab(userWeather); 
})


searchWeather.addEventListener("click" , () => {
        switchTab(searchWeather);
})

function getFromSessionStorage(){
    
    const Localcoordinates =  sessionStorage.getItem("user-coordinates");

    if(!Localcoordinates){
        grantAccess.classList.add("active");
        console.log("grant acces not");
    }
    else{
        
        const coordinates = JSON.parse(Localcoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}



async function  fetchUserWeatherInfo (coordinates){
    const {lat , lon} = coordinates;

    grantAccess.classList.remove("active");
    loading.classList.add("active")

    try {
        
        const response =  await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`);
        const data =await response.json();
        console.log(data);

        loading.classList.remove("active")
        userInfo.classList.add("active");
        renderInfo(data);

    } catch (error) {
        loading.classList.remove("active")
        console.log(error);
    }

}


function renderInfo(weatherInfo){


    const countryName = document.querySelector(".location-name");
    const countryIcon = document.querySelector("[data-contryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const weatherTemp = document.querySelector("[data-weatherTemp]");
    const windspeed = document.querySelector(".windspeed");
    const humidity = document.querySelector(".humidity");
    const clouds = document.querySelector(".cloud");

    countryName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    weatherTemp.innerText = ((weatherInfo?.main?.temp)-273).toFixed(2) + " °C" //300k = 273°C   ex 300k = (3000 - 273)°C = 27°C 
    windspeed.innerText = weatherInfo?.wind?.speed + "m/s";
    humidity.innerText = weatherInfo?.main?.humidity + "%";
    clouds.innerText = weatherInfo?.clouds?.all + "%";


}


grantAccess.addEventListener("click", ()=>{
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("geolocation not support in your system")
    }
})


function showPosition(position){
    const userCoordinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates)
}


const inputSearch = document.querySelector("[data-inputSearch]");

searchForm.addEventListener("submit",(e)=>{
     e.preventDefault();
   

    let cityName = inputSearch.value;
    inputSearch.value = "";

    if(cityName == ""){
        return ;
    }
    else{
        fetchSearchWeatherInfo(cityName);
    }

})

async function fetchSearchWeatherInfo(city){
    notFound.classList.remove("active");
    userInfo.classList.remove("active");
    grantAccess.classList.remove("active");
    loading.classList.add("active")

    try {

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&inits=matric`);
        const data = await response.json();

        loading.classList.remove("active");
        

        if(data?.message == "city not found")
        {
            
            notFound.classList.add("active");

        }
        else{
            userInfo.classList.add("active");
            renderInfo(data)
        }

    } catch (error) {
        
       
    }
}



