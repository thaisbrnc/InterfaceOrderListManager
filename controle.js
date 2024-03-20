var groupsContainer = document.getElementById('groups-container');
var errorMsg = document.getElementById('error-msg');
const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json; charset=utf-8");
myHeaders.append("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
myHeaders.append("Access-Control-Allow-Methods", "*");
myHeaders.append("Access-Control-Allow-Headers", "*");

window.onload =
    function getOrderList() {
        const url = "https://localhost:7163/api/OrderList/GetOrderList";

        let status = 0;

        fetch(url, myHeaders)
            .then((response) => {
                status = response.status;
                return response.json();
            })
            .then((data = response) => {
                if (status === 200) {
                    groupsContainer.innerHTML = "";
                    data.map((group) => {
                        let newGroup = createHtmlNewGroup(group);

                        groupsContainer.innerHTML += newGroup;
                    });

                    blurGroupNamesOnEnter();
                    blurProductNamesOnEnter();
                    addProductButtonOnEnter();
                }
            })
            .catch((err) => {
                console.log(err);
                errorMsg.innerHTML = err;
            })
    }

function addGroup() {
    let inputGroupName = document.getElementById('input-group-name');
    let input = inputGroupName.value.trim();

    if ((input !== "") && (input !== null) && (input !== undefined)) {
        const url = `https://localhost:7163/api/OrderList/AddGroup?name=${input}`;

        let myOptions = {
            method: "PUT",
            headers: myHeaders
        };

        let status = 0;

        fetch(url, myOptions)
            .then((response) => {
                status = response.status;
                return response.json();
            })
            .then((group = response) => {
                if (status == 200) {
                    console.log(group.products);
                    groupsContainer.innerHTML += createHtmlNewGroup(group);

                    inputGroupName.value = "";
                    inputGroupName.focus();
                }

                blurGroupNamesOnEnter();
                addProductButtonOnEnter();
            })
            .catch((err) => {
                console.log(err);
                errorMsg.innerHTML = err;
            })
    }
    else {
        showMessage("Nome do grupo não pode ser vazio");
    }

}

function addProduct(groupName) {
    let inputProductName = document.getElementById(`input-product-${groupName}`);
    let input = inputProductName.value.trim();

    if ((input !== "") && (input !== null) && (input !== undefined)) {
        const url = `https://localhost:7163/api/OrderList/AddProduct?productName=${input}&groupName=${groupName}`;

        let myOptions = {
            method: "POST",
            headers: myHeaders
        };

        let status = 0;

        fetch(url, myOptions)
            .then((response) => {
                status = response.status;
                return response.json();
            })
            .then((product = response) => {
                if (status === 200) {
                    document.getElementById(`area-products-${groupName}`).innerHTML +=
                        createHtmlNewProduct(groupName, product.name);

                    inputProductName.value = "";
                    inputProductName.focus();
                }

                blurProductNamesOnEnter();
            })
            .catch((err) => {
                console.log(err);
                errorMsg.innerHTML = err;
            })
    }
    else {
        showMessage("Nome do produto não pode ser vazio");
    }
}

function editGroup(groupName) {
    console.log(`Editar grupo ${groupName}`);
    let newDescription = document.getElementById(`span-group-name-${groupName}`).innerHTML.trim();
    console.log(`Nova descrição: ${newDescription}`);

    if ((newDescription !== "") && (newDescription !== null) && (newDescription !== undefined)) {
        if (newDescription.toLowerCase() !== groupName.toLowerCase()) {
            const url = `https://localhost:7163/api/OrderList/EditGroup?group=${groupName}&description=${newDescription}`;

            let myOptions = {
                method: "PATCH",
                headers: myHeaders
            };

            let status = 0;

            fetch(url, myOptions)
                .then((response) => {
                    status = response.status;
                    return response.json();
                })
                .then((group = response) => {
                    if (status === 200) {
                        //pega elemento do grupo atual
                        let divGroup = document.getElementById(`group-${groupName}`);
                        //cria a string com os novos dados
                        let divGroupEdited = createHtmlNewGroup(group);

                        //converte a string para DOM, pegando apenas o elemento div
                        let parser = new DOMParser();
                        let newNode = parser.parseFromString(divGroupEdited, "text/html").getElementsByTagName("div")[0];
                    
                        //substitui o node antigo pelo novo na div pai
                        groupsContainer.replaceChild(newNode, divGroup);
                    }
                    else {
                        document.getElementById(`span-group-name-${groupName}`).innerText = groupName;
                    }
                    blurGroupNamesOnEnter();
                    addProductButtonOnEnter();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            document.getElementById(`span-group-name-${groupName}`).innerText = groupName;
        }
    }
    else {
        showMessage("Nome do grupo não pode ser vazio");
    }
}

function editProduct(groupName, productName) {
    console.log(`Editar produto ${productName} do grupo ${groupName}`);
    let newDescription = document.getElementById(`product-name-${groupName}-${productName}`).innerHTML.trim();
    console.log(`Nova descrição: ${newDescription}`);

    if ((newDescription !== "") && (newDescription !== null) && (newDescription !== undefined)) {
        if (newDescription.toLowerCase() !== productName.toLowerCase()) {
            const url = `https://localhost:7163/api/OrderList/EditProduct?group=${groupName}&description=${newDescription}`;

            let myOptions = {
                method: "PATCH",
                headers: myHeaders,
                body: JSON.stringify({ name: productName })
            };

            let status = 0;
            fetch(url, myOptions)
                .then((response) => {
                    status = response.status;
                    return response.json();
                })
                .then((product = response) => {
                    if (status === 200) {
                        //pega elemento de linha atual do produto
                        let liProduct = document.getElementById(`group-${groupName}-product-${productName}`);
                        //cria a string com os novos dados
                        let liProductEdited = createHtmlNewProduct(groupName, product.name, product.isChecked);

                        //converte a string para DOM, pegando apenas o elemento li
                        let parser = new DOMParser();
                        let newNode = parser.parseFromString(liProductEdited, "text/html").getElementsByTagName("li")[0];

                        console.log(newNode);

                        //pega div em que está a linha do produto e substitui o node antigo pelo novo
                        let divAreaProducts = document.getElementById(`area-products-${groupName}`);
                        divAreaProducts.replaceChild(newNode, liProduct);
                    }
                    else {
                        document.getElementById(`product-name-${groupName}-${productName}`).innerText = productName;
                    }

                    blurProductNamesOnEnter();
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        else {
            document.getElementById(`product-name-${groupName}-${productName}`).innerText = productName;
        }
    }
    else {
        showMessage("Nome do produto não pode ser vazio");
    }

}

function removeProduct(groupName, productName) {
    let result = confirm("Deseja excluir esse produto?");

    if (result) {
        console.log(`Remover produto ${productName} do grupo ${groupName}`);
        const url = `https://localhost:7163/api/OrderList/RemoveProduct?group=${groupName}`;

        let myOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: JSON.stringify({ name: productName })
        };

        fetch(url, myOptions)
            .then((response) => {
                return response.text();
            })
            .then((data = response) => {
                console.log(data);

                if (data == "Produto removido com sucesso.") {
                    var liProduct = document.getElementById(`group-${groupName}-product-${productName}`);
                    liProduct.remove();
                }
                else {
                    console.log(data);
                }

                blurProductNamesOnEnter();
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

function removeGroup(groupName) {
    let result = confirm("Deseja excluir esse grupo?");

    if (result) {
        const url = `https://localhost:7163/api/OrderList/RemoveGroup`;

        let myOptions = {
            method: "DELETE",
            headers: myHeaders,
            body: JSON.stringify({ description: groupName })
        };

        fetch(url, myOptions)
            .then((response) => {
                return response.text();
            })
            .then((data = response) => {
                console.log(data);

                if (data == "Grupo removido com sucesso.") {
                    var divGroup = document.getElementById(`group-${groupName}`);
                    divGroup.remove();
                }
                else {
                    console.log(data);
                }

                blurGroupNamesOnEnter();
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

function updateChecked(groupName, productName) {
    let checkbox = document.getElementById(`checkbox-${groupName}-${productName}`);
    let status = checkbox.hasAttribute("checked");

    if (!status) {
        checkbox.setAttribute("checked", !status);
    }
    if (status) {
        checkbox.removeAttribute("checked");
    }

    const url = `https://localhost:7163/api/OrderList/UpdateChecked?group=${groupName}&isChecked=${!status}`;

    let myOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: JSON.stringify({ name: productName })
    };

    fetch(url, myOptions)
        .then((response) => {
            return response.json();
        })
        .then((product = response) => {
            console.log(product);
        })
        .catch((err) => {
            console.log(err);
            errorMsg.innerHTML = err;
        })
}

function createHtmlNewGroup(group) {
    let newGroup =
        `<div id="group-${group.description}" class="group">
            <div class="area-group-name">
                <span class="group-name">Grupo:</span>
                <span id="span-group-name-${group.description}" title="Clique para editar" onfocusout="editGroup('${group.description}')"
                    class="group-name-editable" contenteditable="true">${group.description}</span>
                <span class="span-delete"><button title="Excluir grupo" onclick="removeGroup('${group.description}')" class="delete">x</button></span>
            </div>
            <div class="area-products-buttons">
                <div id="area-products-${group.description}" class="area-products">`;

    group.products.map((product) => {
        let newProduct = createHtmlNewProduct(group.description, product.name, product.isChecked);

        newGroup += newProduct;
    });

    newGroup += `</div>
                <div class="area-add-product">
                    <span class="span-input-product-name">
                        <input id="input-product-${group.description}" class="input-product-name" type="text" placeholder="Novo produto">
                    </span>
                    <span><button id="button-${group.description}" class="add" onclick="addProduct('${group.description}')">+</button></span>
                </div>
            </div>
        </div>`;

    return newGroup;
}

function createHtmlNewProduct(groupName, productName, isChecked) {
    let newProduct =
        `<li id="group-${groupName}-product-${productName}">
            <label for="checkbox-${groupName}-${productName}" class="span-checkbox-product">`;

    if (isChecked === true) {
        newProduct += `<input type="checkbox" checked onclick="updateChecked('${groupName}', '${productName}')" 
                            id="checkbox-${groupName}-${productName}" class="checkbox-product">`;
    }
    else {
        newProduct += `<input type="checkbox" onclick="updateChecked('${groupName}', '${productName}')" 
                            id="checkbox-${groupName}-${productName}" class="checkbox-product">`;
    }

    newProduct += `</label>
                   <span id="product-name-${groupName}-${productName}" onfocusout="editProduct('${groupName}', '${productName}')" 
                        title="Clique para editar" contenteditable="true" class="product-name-editable">${productName}</span>
                    <span class="span-delete"><button title="Excluir produto" onclick="removeProduct('${groupName}', '${productName}')" class="delete">
                        x</button></span>
                </li>`;

    return newProduct;
}
//adiciona evento ao apertar enter para editar grupo
function blurGroupNamesOnEnter() {
    let groupNames = document.getElementsByClassName('group-name-editable');
    for (let i = 0; i < groupNames.length; i++) {
        groupNames[i].addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                groupNames[i].blur();
            }
        })
    }
}
//adiciona evento ao apertar enter para editar produto
function blurProductNamesOnEnter() {
    let productNames = document.getElementsByClassName('product-name-editable');
    for (let i = 0; i < productNames.length; i++) {
        productNames[i].addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                productNames[i].blur();
            }
        })
    }
}
//adiciona evento ao apertar enter para adicionar grupo
document.getElementById('input-group-name').addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('button-add-group').click();
    }
})
//adiciona evento ao apertar enter para adicionar produto
function addProductButtonOnEnter() {
    let inputProductNames = document.getElementsByClassName('input-product-name');
    for (let i = 0; i < inputProductNames.length; i++) {
        let id = inputProductNames[i].getAttribute("id");
        let groupName = id.replace("input-product-", "");

        inputProductNames[i].addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                document.getElementById(`button-${groupName}`).click();
            }
        })
    }
}

function showMessage(message) {
    console.log(message);
    errorMsg.innerText = message;
    clearTimeout();
    setTimeout(function () { errorMsg.innerText = ""; }, 8000);
}