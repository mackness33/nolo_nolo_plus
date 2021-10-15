const itemList = [
    {
        id: 20,
        name: 'Paperonave',
        type: 'Ricreativo',
        description: 'Bellissimo per bambini e coppie, niente preservativi inclusi.',
        price: 39.99,
        img: ['../img/img1.jpg']
    },
    {
        id: 36,
        name: 'Lussurello',
        type: 'Lusso',
        description: 'Per te ma se sei Bill Gates.',
        price: 1499.99,
        img: ['../img/img2.jpeg']
    }
]


const dateInput = document.querySelector('#bookDate .form-control')
const timeInput = document.querySelector('#bookTime .form-select');
const searchBtn = document.querySelector('#searchBtn')


searchBtn.addEventListener('click', ()=>{
    addItem(itemList[0]);
    addItem(itemList[1]);
});

//elimina opezione di prenotazione nel passato se si sceglie la giornata odierna
dateInput.addEventListener('change', (e) => {
    let today = new Date();
    let selectedDate = new Date(e.currentTarget.value);
   
    if(today.toLocaleDateString() ==  selectedDate.toLocaleDateString()){
        let flag = true;
        timeInput.querySelectorAll('option').forEach(element => {
            if(element.value <= today.getHours()){
                element.setAttribute('disabled', 'true');
                if(element.hasAttribute('selected')){
                    element.removeAttribute('selected');
                }
            }
            else{
                if(flag){
                    element.setAttribute('selected','true');
                    flag = false;
                }
                
                element.removeAttribute('disabled');
            }
        });
    }
    else{
        timeInput.querySelectorAll('option').forEach(element => {
            if(element.hasAttribute('selected')){
                element.removeAttribute('selected');
            }
            element.removeAttribute('disabled');
        });
        timeInput.querySelector('option').setAttribute('selected', 'true');
    }
});


//diabilita' la possibilita' di prenotare in date nel passato
window.addEventListener('DOMContentLoaded', ()=>{
    let today = new Date();

    dateInput.setAttribute('min', today.toISOString().split('T')[0]);
    today.setDate(today.getDate() + 90);
    dateInput.setAttribute('max', ((today.toISOString()).split('T')[0]));
});

function addItem(item){
    let itemhtml = `<div class="container my-4 border border-primary rounded item-type">
    <div class="row my-2">
        <div class="col-md-2 ">
            <a href="#">
                <img src="${item.img[0]}" alt="immagine di pedalo'" class="rounded float-left">
            </a>
        </div>
        <div class="col-md-7 d-flex flex-column">
            <div class="row my-1">
                <div class="col-md d-flex flex-column">
                    <div class="item-description">Nome:</div>
                    <div class="item-name">${item.name}</div>
                </div>
                <div class="col-md-9 d-flex flex-column">
                    <div class="item-description">Tipo:</div>
                    <div class="item-type">${item.type}</div>
                </div>
            </div>
            
            <div class="item-description">Caratteristiche:</div>
            <div class="row">
                <div class="item-properties">${item.description}</div>
            </div>
        </div>
        <div class="col-md-3 d-flex flex-column align-items-center">
            <div class="row d-flex">
                <div class=" m-3 d-flex flex-row align-items-top total-price">
                    <div class="d-flex flex-column price-high align-self-start">
                        ${item.price.toString().split(".")[0]}
                    </div>
                    <div class="d-flex flex-row price-low-container ">
                        <p>
                            , <span class="price-low">
                                ${item.price.toString().split(".")[1]}
                            </span> / h
                        </p>
                    </div>
                </div>
            </div>
            <div class=" row h-50 w-100 d-flex">
                <button type="button" class="btn btn-success w-100"><h2>Prenota</h2></button>
            </div>
        </div>
    </div>
    </div>`;

    let node = document.createElement(null);
    node.innerHTML = itemhtml;
    document.querySelector('.item-list').appendChild(node);
}