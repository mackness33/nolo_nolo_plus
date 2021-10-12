

window.addEventListener('DOMContentLoaded', ()=>{
    let dateInput = document.getElementById('bookDate').querySelector('.form-control');
    
    dateInput.setAttribute('min', (new Date()).toISOString().split('T')[0]);
});