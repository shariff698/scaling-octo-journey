// script.js

// ==========================================
// DEMO TRADING DASHBOARD
// Frontend learning project only.
// No real trades are sent to any broker.
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const chart = document.getElementById("tradingChart");
const ctx = chart.getContext("2d");

const symbolTitle = document.getElementById("symbolTitle");
const symbolDescription = document.getElementById("symbolDescription");

const currentPrice = document.getElementById("currentPrice");
const priceLine = document.getElementById("priceLine");
const closePrice = document.getElementById("closePrice");

const orderSymbol = document.getElementById("orderSymbol");
const orderPrice = document.getElementById("orderPrice");

const buyPrice = document.getElementById("buyPrice");
const sellPrice = document.getElementById("sellPrice");

const quantityInput = document.getElementById("quantity");

const welcomeButton = document.getElementById("welcomeButton");
const executeButton = document.getElementById("executeButton");

const contactSearch = document.getElementById("marketSearch");


// ==========================================
// DEMO MARKET DATA
// ==========================================

const markets = {

    EURUSD: {
        name: "EUR/USD",
        description: "Euro / US Dollar",
        price: 1.17482,
        change: "+0.42%"
    },

    GBPUSD: {
        name: "GBP/USD",
        description: "British Pound",
        price: 1.34126,
        change: "+0.28%"
    },

    USDJPY: {
        name: "USD/JPY",
        description: "US Dollar / Japanese Yen",
        price: 148.420,
        change: "-0.31%"
    },

    XAUUSD: {
        name: "XAU/USD",
        description: "Gold / US Dollar",
        price: 3854.70,
        change: "+0.76%"
    },

    BTCUSD: {
        name: "BTC/USD",
        description: "Bitcoin / US Dollar",
        price: 109420,
        change: "+1.24%"
    }

};


// ==========================================
// CURRENT MARKET
// ==========================================

let selectedSymbol = "EURUSD";


// ==========================================
// CHART DATA
// ==========================================

let candleData = [];

let basePrice = markets.EURUSD.price;


// Generate simulated candle data

function generateCandles() {

    candleData = [];

    let price = basePrice;

    for (let i = 0; i < 60; i++) {

        const open = price;

        const movement =
            (Math.random() - 0.48) * 0.002;

        const close = open + movement;

        const high =
            Math.max(open, close) +
            Math.random() * 0.001;

        const low =
            Math.min(open, close) -
            Math.random() * 0.001;

        candleData.push({
            open: open,
            high: high,
            low: low,
            close: close
        });

        price = close;
    }

}


// ==========================================
// DRAW TRADING CHART
// ==========================================

function drawChart() {

    const rect = chart.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const devicePixelRatioValue =
        window.devicePixelRatio || 1;

    chart.width = width * devicePixelRatioValue;
    chart.height = height * devicePixelRatioValue;

    ctx.setTransform(
        devicePixelRatioValue,
        0,
        0,
        devicePixelRatioValue,
        0,
        0
    );

    ctx.clearRect(0, 0, width, height);


    // --------------------------------------
    // GRID
    // --------------------------------------

    ctx.strokeStyle = "#1c293d";
    ctx.lineWidth = 1;

    for (let x = 0; x < width; x += 70) {

        ctx.beginPath();

        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);

        ctx.stroke();

    }

    for (let y = 0; y < height; y += 50) {

        ctx.beginPath();

        ctx.moveTo(0, y);
        ctx.lineTo(width, y);

        ctx.stroke();

    }


    // --------------------------------------
    // PRICE RANGE
    // --------------------------------------

    const prices = candleData.flatMap(c => [
        c.high,
        c.low
    ]);

    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    const priceRange = maxPrice - minPrice;


    // --------------------------------------
    // DRAW CANDLES
    // --------------------------------------

    const candleWidth =
        Math.max(3, width / candleData.length * 0.55);

    const spacing =
        width / candleData.length;


    candleData.forEach((candle, index) => {

        const x =
            index * spacing + spacing / 2;


        const openY =
            height -
            ((candle.open - minPrice) / priceRange) *
            height;


        const closeY =
            height -
            ((candle.close - minPrice) / priceRange) *
            height;


        const highY =
            height -
            ((candle.high - minPrice) / priceRange) *
            height;


        const lowY =
            height -
            ((candle.low - minPrice) / priceRange) *
            height;


        const bullish =
            candle.close >= candle.open;


        // Wick

        ctx.strokeStyle =
            bullish ? "#22c55e" : "#ef4444";

        ctx.beginPath();

        ctx.moveTo(x, highY);
        ctx.lineTo(x, lowY);

        ctx.stroke();


        // Body

        const bodyTop =
            Math.min(openY, closeY);

        const bodyHeight =
            Math.max(
                Math.abs(closeY - openY),
                2
            );


        ctx.fillStyle =
            bullish ? "#22c55e" : "#ef4444";


        ctx.fillRect(
            x - candleWidth / 2,
            bodyTop,
            candleWidth,
            bodyHeight
        );

    });


    // --------------------------------------
    // SUPPORT LINE
    // --------------------------------------

    const supportPrice =
        minPrice + priceRange * 0.18;

    const supportY =
        height -
        ((supportPrice - minPrice) / priceRange) *
        height;


    ctx.strokeStyle = "#22c55e";
    ctx.setLineDash([6, 6]);

    ctx.beginPath();

    ctx.moveTo(0, supportY);
    ctx.lineTo(width, supportY);

    ctx.stroke();


    // --------------------------------------
    // RESISTANCE LINE
    // --------------------------------------

    const resistancePrice =
        maxPrice - priceRange * 0.18;

    const resistanceY =
        height -
        ((resistancePrice - minPrice) / priceRange) *
        height;


    ctx.strokeStyle = "#ef4444";

    ctx.beginPath();

    ctx.moveTo(0, resistanceY);
    ctx.lineTo(width, resistanceY);

    ctx.stroke();

    ctx.setLineDash([]);

}


// ==========================================
// SELECT MARKET
// ==========================================

function selectMarket(symbol) {

    const market = markets[symbol];

    if (!market) {
        return;
    }

    selectedSymbol = symbol;

    basePrice = market.price;


    symbolTitle.textContent =
        market.name;

    symbolDescription.textContent =
        market.description;


    currentPrice.textContent =
        formatPrice(market.price);

    closePrice.textContent =
        formatPrice(market.price);

    priceLine.textContent =
        formatPrice(market.price);

    orderSymbol.textContent =
        market.name;

    orderPrice.textContent =
        formatPrice(market.price);


    updateBuySellPrices(market.price);

    generateCandles();
    drawChart();

}


// ==========================================
// PRICE FORMATTING
// ==========================================

function formatPrice(price) {

    if (price >= 1000) {

        return price.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    }

    if (price >= 10) {

        return price.toFixed(3);

    }

    return price.toFixed(5);

}


// ==========================================
// BUY / SELL PRICES
// ==========================================

function updateBuySellPrices(price) {

    let spread;

    if (price > 1000) {

        spread = 0.50;

    } else if (price > 10) {

        spread = 0.006;

    } else {

        spread = 0.00006;

    }


    buyPrice.textContent =
        formatPrice(price + spread);

    sellPrice.textContent =
        formatPrice(price - spread);

}


// ==========================================
// WATCHLIST CLICK EVENTS
// ==========================================

const marketItems =
    document.querySelectorAll(".market-item");


marketItems.forEach(item => {

    item.addEventListener("click", function () {

        marketItems.forEach(button => {

            button.classList.remove("active");

        });


        this.classList.add("active");


        const symbol =
            this.dataset.symbol;


        selectMarket(symbol);

    });

});


// ==========================================
// SEARCH MARKETS
// ==========================================

contactSearch.addEventListener(
    "input",
    function () {

        const search =
            this.value.toLowerCase();


        marketItems.forEach(item => {

            const text =
                item.textContent.toLowerCase();


            item.style.display =
                text.includes(search)
                    ? "flex"
                    : "none";

        });

    }
);


// ==========================================
// TIMEFRAME BUTTONS
// ==========================================

const timeframeButtons =
    document.querySelectorAll(".timeframe");


timeframeButtons.forEach(button => {

    button.addEventListener("click", function () {

        timeframeButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        generateCandles();

        drawChart();

    });

});


// ==========================================
// ORDER TYPE TABS
// ==========================================

const orderTabs =
    document.querySelectorAll(".order-tab");


orderTabs.forEach(tab => {

    tab.addEventListener("click", function () {

        orderTabs.forEach(item => {

            item.classList.remove("active");

        });


        this.classList.add("active");

    });

});


// ==========================================
// QUANTITY CONTROLS
// ==========================================

document
    .getElementById("minusQuantity")
    .addEventListener("click", function () {

        let quantity =
            parseFloat(quantityInput.value);

        quantity -= 0.01;

        if (quantity < 0.01) {
            quantity = 0.01;
        }

        quantityInput.value =
            quantity.toFixed(2);

    });


document
    .getElementById("plusQuantity")
    .addEventListener("click", function () {

        let quantity =
            parseFloat(quantityInput.value);

        quantity += 0.01;

        quantityInput.value =
            quantity.toFixed(2);

    });


// ==========================================
// BUY BUTTON
// ==========================================

document
    .getElementById("buyButton")
    .addEventListener("click", function () {

        alert(
            "Demo BUY selected for " +
            markets[selectedSymbol].name
        );

    });


// ==========================================
// SELL BUTTON
// ==========================================

document
    .getElementById("sellButton")
    .addEventListener("click", function () {

        alert(
            "Demo SELL selected for " +
            markets[selectedSymbol].name
        );

    });


// ==========================================
// DEMO ORDER
// ==========================================

executeButton.addEventListener(
    "click",
    function () {

        const quantity =
            quantityInput.value;

        const market =
            markets[selectedSymbol];


        alert(
            "DEMO ORDER\n\n" +
            "Symbol: " + market.name + "\n" +
            "Size: " + quantity + "\n" +
            "Price: " + formatPrice(market.price) +
            "\n\nNo real order was placed."
        );

    }
);


// ==========================================
// INDICATOR BUTTON
// ==========================================

document
    .getElementById("indicatorButton")
    .addEventListener("click", function () {

        alert(
            "Indicators panel demo\n\n" +
            "Future indicators can include:\n" +
            "• Moving Average\n" +
            "• RSI\n" +
            "• MACD\n" +
            "• Bollinger Bands\n" +
            "• Volume"
        );

    });


// ==========================================
// WELCOME BUTTON
// ==========================================

welcomeButton.addEventListener(
    "click",
    function () {

        alert(
            "Welcome to TradePro!\n\n" +
            "This is a demo trading interface " +
            "built with HTML, CSS and JavaScript."
        );

    }
);


// ==========================================
// THEME BUTTON
// ==========================================

document
    .getElementById("themeButton")
    .addEventListener("click", function () {

        document.body.classList.toggle("light-mode");

    });


// ==========================================
// FULLSCREEN CHART
// ==========================================

document
    .getElementById("fullscreenButton")
    .addEventListener("click", function () {

        const chartPanel =
            document.querySelector(".chart-panel");


        if (document.fullscreenElement) {

            document.exitFullscreen();

        } else {

            chartPanel.requestFullscreen();

        }

    });


// ==========================================
// SIMULATED PRICE MOVEMENT
// ==========================================

setInterval(function () {

    const market =
        markets[selectedSymbol];


    const movement =
        (Math.random() - 0.5) *
        (market.price > 100 ? 0.05 : 0.0002);


    market.price += movement;


    currentPrice.textContent =
        formatPrice(market.price);

    closePrice.textContent =
        formatPrice(market.price);

    priceLine.textContent =
        formatPrice(market.price);

    orderPrice.textContent =
        formatPrice(market.price);


    updateBuySellPrices(
        market.price
    );


    generateCandles();
    drawChart();

}, 3000);


// ==========================================
// RESIZE CHART
// ==========================================

window.addEventListener(
    "resize",
    function () {

        drawChart();

    }
);


// ==========================================
// START APPLICATION
// ==========================================

generateCandles();

drawChart();

selectMarket("EURUSD");
