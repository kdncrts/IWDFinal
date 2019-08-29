let selectedList = "";

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

function login() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value

    if(username != "" && password != "") {
        // ajax call on /login
        var json = {
            username: username,
            password: password
        }
        
    }

    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
    return false;
}