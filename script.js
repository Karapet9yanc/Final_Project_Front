let allPurchases = [];
let inputWhere = null;
let inputHow = null;
let valueInputShop = "";
let valueInputPrice = "";
let sumBuy = 0;

const day = new Date().toJSON().split("T")[0];

window.onload = async () => {
  inputWhere = document.querySelector("#midll-window");
  inputHow = document.querySelector("#second-window");
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
        text: valueInputShop,
        text2: valueInputPrice,
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
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
};

const render = () => {
  const expenses = document.getElementById("shopping");
  while (expenses.firstChild) {
    expenses.removeChild(expenses.firstChild);
  }
  allPurchases.map((item, index) => {
    const container = document.createElement("div");
    container.className = "allPurchases-container";
    container.id = `task-${index}`;
    const block1 = document.createElement("div");
    block1.id = `first`;
    const one = document.createElement("div");
    one.id = `clone`;
    const two = document.createElement("div");
    two.id = `result`;
    const nameShop = document.createElement("p");
    nameShop.innerText = `${index + 1}) Магазин :`;
    const text = document.createElement("p");
    text.id = `elem`;
    text.innerText = item.text;
    one.appendChild(nameShop);
    two.appendChild(text);
    block1.appendChild(one);
    block1.appendChild(two);
    expenses.appendChild(block1);
    const blockData = document.createElement("div");
    blockData.id = "data1";
    const date = document.createElement("p");
    date.className = "date";
    date.innerText = item.date;
    blockData.appendChild(date);
    const block2 = document.createElement("div");
    block2.id = "second";
    const how = document.createElement("p");
    how.innerText = item.text2;
    const verstka = document.createElement("div");
    verstka.id = "verstka";
    const Rub = document.createElement("span");
    Rub.innerText = " р.";
    how.appendChild(Rub);
    block2.appendChild(how);
    sumBuy = sumBuy + Number(item.text2);
    const imageClick = document.createElement("div");
    imageClick.id = "imageClick";
    const imageSave = document.createElement("img");
    imageSave.src = "img/save.png";
    const imageEdit = document.createElement("img");
    imageEdit.src = "img/edit.png";
    const inpSave = document.createElement("input");
    inpSave.id = "ret";
    const inpReplace = document.createElement("input");
    inpReplace.type = "number";
    inpReplace.id = "ret";
    const inpData = document.createElement("input");
    inpData.type = "date";
    inpData.id = "ret";
    imageEdit.onclick = () => {
      two.replaceChild(inpSave, text);
      blockData.replaceChild(inpData, date);
      block2.replaceChild(inpReplace, how);
      imageClick.replaceChild(imageSave, imageEdit);
      inpSave.value = item.text;
      inpReplace.value = item.text2;
      inpData.value = item.date;
    };
    imageSave.onclick = async () => {
      if (
        (item.text = inpSave.value.trim()) &&
        (item.text2 = inpReplace.value)
      ) {
        two.replaceChild(text, inpSave);
        block2.replaceChild(how, inpReplace);
        text.innerText = inpSave.value;
        how.innerText = inpReplace.value;
        item.date = inpData.value;
        item.text = inpSave.value;
        item.text2 = inpReplace.value;
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
    purchase.appendChild(block1);
    purchase.appendChild(blockData);
    purchase.appendChild(block2);
    purchase.appendChild(imageClick);
    purchase.appendChild(verstka);
    verstka.appendChild(blockData);
    verstka.appendChild(block2);
    verstka.appendChild(imageClick);
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
        "Content-Type": "text/html; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
  const result = await resp.json();
  allPurchases = result.data;
  render();
};
