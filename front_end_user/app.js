
const dateInput = document.querySelector('#bookDate .form-control')
const timeInput = document.querySelector('#bookTime .form-select');

//console.log(timeInput.removeChild(timeInput.querySelector('option')));

dateInput.addEventListener('change', (e) => {
    let today = new Date();
    let selectedDate = new Date(e.currentTarget.value);

    if(today.toLocaleDateString() ==  selectedDate.toLocaleDateString()){
        timeInput.querySelectorAll('option').forEach(element => {
            if(element.value <= today.getHours()){
                element.setAttribute('disabled', 'true');
            }
            else{
                element.removeAttribute('disabled');
                element.setAttribute('selected', '');
            }
        });
    }
    else{
        timeInput.querySelectorAll('option').forEach(element => {
            element.removeAttribute('disabled');
        });
    }
});

window.addEventListener('DOMContentLoaded', ()=>{
    let today = new Date();

    dateInput.setAttribute('min', today.toISOString().split('T')[0]);
    today.setDate(today.getDate() + 90);
    dateInput.setAttribute('max', ((today.toISOString()).split('T')[0]));
});

