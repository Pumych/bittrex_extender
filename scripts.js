console.log(' :: Bittrex extender: scripts.js Loaded');

let checkedTimes = 0;
let coin = '';

$(document).ready(function(){

    $(function(){
        console.log(' :: Bittrex extender: document ready');
        let url = window.location.toString();
        coin = url.split('-')[1];
        checkContainer();
    });
});

function elementIsVisible(){
    console.log(' :: Bittrex extender: element appeared!');
    let times = $('#closedMarketOrdersTable td.date.sorting_1');

    for(let i=0; i< times.length; i++){
        let time = new Date(times[i].innerText).getTime()/1000;
        let before = 0;

        $.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${time}`, function(data){
            before = data[coin]['USD'];
            times[i].innerHTML = times[i].innerHTML + `<span class="bte-text" title="Price in USD at closed date"> | $${before} </span>`;
            getCurrent(coin, times, before, i);
        }).always(function(msg) {
            console.log(msg);
        });
    }
}

function getCurrent(coin, times, before, i){
    let now = 0;
    let currTime = Math.floor(new Date().getTime()/1000);
    $.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${currTime}`, function(data){
        now = data[coin]['USD'];
        let delta = calcDelta(before, now);
        let profitClass = delta >= 0 ? 'green' : 'red';
        times[i].innerHTML = times[i].innerHTML + `<span class="bte-text ` + profitClass + `" title="Delta price"> ( ${delta}% )</span>`;
    }).always(function(msg) {
        console.log(msg);
    });
}

function calcDelta(before, now){
    if( now == before ) return 0;
    let delta = now > before ? ((now-before)/before)*100 : -((before-now)/before)*100;
    return delta.toFixed(1);
}

function checkContainer () {
    checkedTimes++;
    if($('#closedMarketOrdersTable td.date.sorting_1').is(':visible')){ //if the container is visible on the page
        elementIsVisible();
    } else {
        setTimeout(checkContainer, 500); //wait 50 ms, then try again
    }
}











