console.log(' :: Bittrex extender: scripts.js Loaded');

let url = new URL(window.location.href);
let pair = url.searchParams.get("MarketName").split('-');
let currentPrice = 0;
let TICK_LENGTH = 500;
let isElmUpdated = {
    myOrderHistory: false
};

$(document).ready(function(){
    getPairPrice(pair[1], 'USD', 0, function(data){
        currentPrice = data[pair[1]]['USD'];
    });

    $(function(){
        setInterval(tick, TICK_LENGTH);
    });
});

/**
 * Do every tick the following
 */
function tick(){
    myOrderHistoryDomUpdate();
}

/**
 * Updates Order History Dom
 */
function myOrderHistoryDomUpdate(){
    if($('#closedMarketOrdersTable td.date.sorting_1').is(':visible') && !isElmUpdated.myOrderHistory){
        let closedMarketOrdersElms = $('#closedMarketOrdersTable td.date.sorting_1');
        isElmUpdated.myOrderHistory = true;

        for(let i=0; i< closedMarketOrdersElms.length; i++){
            let time = new Date(closedMarketOrdersElms[i].innerText).getTime()/1000;
            let before = 0;

            getPairPrice(pair[1], 'USD', time, function(data){
                before = data[pair[1]]['USD'];
                let delta = calcDelta(before, currentPrice);
                let profitClass = delta >= 0 ? 'green' : 'red';
                closedMarketOrdersElms[i].innerHTML = closedMarketOrdersElms[i].innerHTML + `
                    <span class="bte-text" title="Price in USD at closed date"> | $${before} </span>
                    <span class="bte-text ` + profitClass + `" title="Delta price"> ( ${delta}% )</span>
                `;
            });
        }
    }
}

/**
 * Get pair price at specified timestamp (or at this moment) from Cryptocompare API and execute callback
 *
 * @param srcCoin
 * @param trgCoin
 * @param ts
 * @param callback
 */
function getPairPrice(srcCoin, trgCoin, ts, callback){
    let timeStamp = !!ts ? ts : Math.floor(new Date().getTime()/1000);
    console.log(`getPairPrice() timeStamp: `, timeStamp);
    srcCoin = srcCoin.toUpperCase();
    trgCoin = trgCoin.toUpperCase();
    $.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=${srcCoin}&tsyms=${trgCoin}&ts=${timeStamp}`, function(data){
        if(typeof callback == 'function'){
            callback(data);
        }
    }).always(function(msg) {
        console.log(` >>> getPairPrice('${srcCoin}', '${trgCoin}', ${ts}): ` + JSON.stringify(msg));
    });
}

// Returns delta of change 'before' vs 'now'
function calcDelta(before, now){
    if( now == before ) return 0;
    let delta = now > before ? ((now-before)/before)*100 : -((before-now)/before)*100;
    return delta.toFixed(1);
}













