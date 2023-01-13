function loadItems() {
    const Http = new XMLHttpRequest();
    Http.responseType = "json";
    const url = "http://127.0.0.1:8085/getPositions";
    Http.open("POST", url);
    Http.send();
  
    Http.onreadystatechange = function () {
        if (Http.readyState == XMLHttpRequest.DONE) {
            itemsPositions = Http.response;
            initItemPositions(itemsPositions);
        }
    };
    
    Http.onerror = function () {
        alert("Ошибка " + Http.response);
    };
}

function updateInventory(inventory) {
    var table = "<tr><td>Инвентарь</td></tr>";
    inventory.split(",").forEach(function (element) {
        table += "<tr><td>" + element + "</td></tr>";
    });
    document.getElementById('inventory').innerHTML = table;
}

function pickItem(id, x, y) {
    quantity = 1;
    for (index = 0; index < items.length; index++) {
        item = items[index];
        if (item.x == x && item.y == y && item.id == id) {
            items.splice(index, 1);
            mgrSocket.send("INV"); // Update inventory
            updateAll();
            return;
        }
    }
}

function initItemPositions(itemsPositions) {
    console.log(itemsPositions);
    keys = Object.keys(itemsPositions);
    keys.forEach(function (key) {
        pos = key.split(",")
        buffer = itemsPositions[key]
        buffer.forEach(function(item) {
            if (typeof item != 'undefined') {
                try {
                    x = parseInt(pos[0]);
                    y = parseInt(pos[1]);
                    items.push(new component(x, y, item, images[item]["img"]));
                    items[items.length - 1].newPos(x, y);
                } catch(error) {
                    console.error(error);
                    console.log(item);
                    console.log(images[item]);
                }
            }
        });
    });
    console.log(items);
    //itemsPositions.forEach(function (position) {
    //});
}