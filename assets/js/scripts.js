const key = '64f2ee2a8261daa4d9f780f5b365f275';
const today = new Date();
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

const cityHist = [];
$('.search').on("click", function (event) {
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    cityHist.push(city);
    getHistory();
    getWeatherToday();
});

const contHistEl = $('.cityHist');
function getHistory() {
    contHistEl.empty();

    for (let i = 0; i < cityHist.length; i++) {

        const rowEl = $('<row>');
        const btnEl = $('<button>').text(`${cityHist[i]}`)

        rowEl.addClass('row histBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');

        contHistEl.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    }

    $('.histBtn').on("click", function (event) {
        fiveForecastEl.empty();
        getWeatherToday();
    });
};

const cardTodayBody = $('.cardBodyToday')
function getWeatherToday() {
    const getUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`;

    $(cardTodayBody).empty();

    $.ajax({
        url: getUrlCurrent,
    }).then(function (response) {
        $('.cardTodayCityName').text(response.name);
        $('.cardTodayDate').text(date);
        $('.icons').attr('src', `http://openweathermap.org/img/wn/10d@2x.png`);

        const pEl = $('<p>').text(`Temperature: ${response.main.temp} °F`);
        cardTodayBody.append(pEl);

        const pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
        cardTodayBody.append(pElHumid);

        const pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
        cardTodayBody.append(pElWind);
    });
    getFiveDayForecast();
};

const fiveForecastEl = $('.fiveForecast');

function getFiveDayForecast() {
    const getUrlFiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`;

    $.ajax({
        url: getUrlFiveDay,
    }).then(function (response) {
        const fiveDayArray = response.list;
        const myWeather = [];

        $.each(fiveDayArray, function (index, value) {
            const testObj = {
                date: value.dt_txt.split(' ')[0],
                temp: value.main.temp,
                icon: value.weather[0].icon,
                humidity: value.main.humidity,
                wind: value.main.wind
            }

            if (value.dt_txt.split(' ')[1] === "12:00:00") {
                myWeather.push(testObj);
            }
        })

        for (let i = 0; i < myWeather.length; i++) {

            const divElCard = $('<div>');
            divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
            divElCard.attr('style', 'max-width: 200px;');
            fiveForecastEl.append(divElCard);

            const divElHeader = $('<div>');
            divElHeader.attr('class', 'card-header')
            const m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
            divElHeader.text(m);
            divElCard.append(divElHeader)

            const divElBody = $('<div>');
            divElBody.attr('class', 'card-body');
            divElCard.append(divElBody);

            const divElIcon = $('<img>');
            divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
            divElBody.append(divElIcon);

            const pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp} °F`);
            divElBody.append(pElTemp);

            const pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity} %`);
            divElBody.append(pElHumid);

            const pElWind = $('<p>').text(`Wind: ${myWeather[i].humidity} MPH`);
            divElBody.append(pElWind)
        }
    });
};