// var Chart = require('chart.js');
let selectedList = "";

window.onload = () => {
    populateCanvas("toppings", "User toppings");
    populateCanvas("colors", "Favorite colors");
    populateCanvas("random", "Random numbers chosen");
};

const populateCanvas = (canvasId, label) => {
    const element = document.getElementById(canvasId);
    if(element){
        const data = JSON.parse(element.getAttribute('data'));
        let totalValue = 0;
        Object.values(data).forEach(value=> totalValue+=value);
        var myChart = new Chart(element, {
            type: 'bar',
            data: {
                labels: Object.keys(data),
                datasets: [{
                    label: label,
                    data: Object.values(data),
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                min: 0,
                                max: totalValue,
                                callback: (value => {return (value / totalValue * 100).toFixed(0) + '%'})
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Percentage',
                            },
                        },
                    ]
                }
            }
        });
    }
}

const toggleCardList = (name) => {
    const selectedElement = document.getElementById(name);
    if(selectedElement && selectedList !== name){
        // update which list is selected
        if(selectedList){
            document.getElementById(selectedList).classList.remove("selected");
        }
        selectedList = name;
        selectedElement.classList.add("selected");
        
        // update card display
        const cardDisplay = document.getElementById("cardDisplay");
        cardDisplay.innerHTML = "";
        const cardData = JSON.parse(document.getElementById(name).getAttribute("carddata"));
        if(cardData){
            cardData.forEach(card => {
                cardDisplay.innerHTML += createCard(card);
            });
        }
    }
}

const createCard = (card) => {
    console.log(card);
    return (
    "<div class=\"cardContainer\">" +
        "<div class=\"center\">" +
            card.name +
        "</div>" +
        "<hr/>" +
        "<div class=\"center\">" +
            card.description +
        "</div>" +
        "<div class=\"cardImgContainer\">" +
            "<img src=" + card.img + " class=\"cardImg\" />" +
        "</div>" +
        "<div class=\"cardButtons\">" +
            "<a class=\"cardButton\" href=\"/buy?card=" + card.id + "\">Trade</a>" +
        "</div>" +
    "</div>"
    )
}

var edit = false;

function reverseEdit() {
    edit = !edit;
}