let allPurchases = [];
let inputWhere = null;
let inputHow = null;
let valueInputShop = "";
let valueInputPrice = "";
let sumBuy = 0;

const day = new Date().toJSON().split("T")[0];

window.onload = async () => {
  inputWhere = document.querySelector("#input-shop");
  inputHow = document.querySelector("#input-price");
  inputWhere.addEventListener("change", updateValueMagazin);
  inputHow.addEventListener("change", updateValuePrice);

  const resp = await fetch("http://localhost:8000/allPurchases", {
    method: "GET",
  });
  const result = await resp.json();
  allPurchases = result.data;
  render();
};

const onclickButtom = async () => {
  if (valueInputShop && valueInputPrice) {
    const resp = await fetch("http://localhost:8000/createPurchase", {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        shop: valueInputShop,
        price: valueInputPrice,
        date: day,
      }),
    });
    const result = await resp.json();
    allPurchases.push(result.data);

    valueInputPrice = "";
    valueInputShop = "";
    inputHow.value = "";
    inputWhere.value = "";
    render();
  } else {
    alert("Введите в пустое поле значение");
  }
};

const updateValueMagazin = (event) => {
  valueInputShop = event.target.value;
};
const updateValuePrice = (event) => {
  valueInputPrice = event.target.value;
};

const validate = (evt) => {
  const theEvent = evt || window.event;
  let onlyNum = theEvent.onlyNumCode || theEvent.which;
  onlyNum = String.fromCharCode(onlyNum);
  const regex = /[0-9]|\./;
  if (!regex.test(onlyNum)) {
    theEvent.editurnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
};

const render = () => {
  const expenses = document.getElementById("shopping");
  while (expenses.firstChild) {
    expenses.removeChild(expenses.firstChild);
  }
  allPurchases.map((item, index) => {
    let { shop, price, date } = item;
    const container = document.createElement("div");
    container.className = "allPurchases-container";
    container.id = `task-${index}`;
    const shopName = document.createElement("div");
    shopName.id = `div-element-shop`;
    const spanShop = document.createElement("div");
    spanShop.id = `span-shop`;
    const divShop = document.createElement("div");
    divShop.id = `name-shop`;
    const nameShop = document.createElement("p");
    nameShop.innerText = `${index + 1}) Магазин :`;
    const element = document.createElement("p");
    element.id = `elem`;
    element.innerText = shop;

    spanShop.appendChild(nameShop);
    divShop.appendChild(element);
    shopName.appendChild(spanShop);
    shopName.appendChild(divShop);
    expenses.appendChild(shopName);
    const divDateElement = document.createElement("div");
    divDateElement.id = "data";
    const elementDate = document.createElement("p");
    elementDate.className = "date";
    elementDate.innerText = date;
    divDateElement.appendChild(elementDate);
    const divHowMuch = document.createElement("div");
    divHowMuch.id = "div-how-much";
    const elementHowMuch = document.createElement("p");
    elementHowMuch.innerText = price;
    const divElementPurchases = document.createElement("div");
    divElementPurchases.id = "div-element-purchases";
    const Rub = document.createElement("span");
    Rub.innerText = " р.";
    elementHowMuch.appendChild(Rub);
    divHowMuch.appendChild(elementHowMuch);
    sumBuy = sumBuy + Number(price);
    const imageClick = document.createElement("div");
    imageClick.id = "imageClick";
    const imageSave = document.createElement("img");
    imageSave.src = "img/save.png";
    const imageEdit = document.createElement("img");
    imageEdit.src = "img/edit.png";
    const inpSave = document.createElement("input");
    inpSave.id = "edit-price";
    const inpReplace = document.createElement("input");
    inpReplace.type = "number";
    inpReplace.id = "edit";
    const inpData = document.createElement("input");
    inpData.type = "date";
    inpData.id = "edit";
    imageEdit.onclick = () => {
      divShop.replaceChild(inpSave, element);
      divDateElement.replaceChild(inpData, elementDate);
      divHowMuch.replaceChild(inpReplace, elementHowMuch);
      imageClick.replaceChild(imageSave, imageEdit);
      inpSave.value = shop;
      inpReplace.value = price;
      inpData.value = date;
    };
    imageSave.onclick = async () => {
      if (inpSave.value.trim() && inpReplace.value.trim) {
        divShop.replaceChild(element, inpSave);
        divHowMuch.replaceChild(elementHowMuch, inpReplace);
        element.innerText = inpSave.value;
        elementHowMuch.innerText = inpReplace.value;
        date = inpData.value;
        shop = inpSave.value;
        price = inpReplace.value;
        const resp = await fetch("http://localhost:8000/updatePurchase", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify(...allPurchases),
        });
        const result = await resp.json();
        allPurchases = result.data;
        render();
      } else {
        alert("Заполните пустоле поле!!!");
      }
    };
    imageClick.appendChild(imageEdit);
    const purchase = document.createElement("div");
    purchase.id = "purchase";
    const imageDelete = document.createElement("img");
    imageDelete.src = "img/delete.png";
    imageDelete.onclick = () => {
      expenses.removeChild(purchase);
      onDeleteallPurchases(index);
    };
    imageClick.appendChild(imageDelete);
    expenses.appendChild(imageClick);
    purchase.appendChild(shopName);
    purchase.appendChild(divDateElement);
    purchase.appendChild(divHowMuch);
    purchase.appendChild(imageClick);
    purchase.appendChild(divElementPurchases);
    divElementPurchases.appendChild(divDateElement);
    divElementPurchases.appendChild(divHowMuch);
    divElementPurchases.appendChild(imageClick);
    expenses.appendChild(purchase);
  });
  const byend = document.getElementById("byend");
  byend.innerText = sumBuy;
  sumBuy = 0;
};
const onDeleteallPurchases = async (index) => {
  const resp = await fetch(
    `http://localhost:8000/deletePurchase?_id=${allPurchases[index]._id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "shop/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const result = await resp.json();
  allPurchases = result.data;
  render();
};
