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
        $.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${coin}&tsyms=USD&ts=${time}`, function(data){
            times[i].innerHTML = times[i].innerHTML + `<span class="bte-text" title="Price in USD at closed date"> ( $${data[coin]['USD']} )</span>`;
        }).always(function(msg) {
            console.log(msg);
        });
    }
}

function checkContainer () {
    checkedTimes++;
    if($('#closedMarketOrdersTable td.date.sorting_1').is(':visible')){ //if the container is visible on the page
        elementIsVisible();
    } else {
        setTimeout(checkContainer, 500); //wait 50 ms, then try again
    }
}











