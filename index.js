const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // defualt mode is CREATE
let selectedId = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);

    if (id) {
        mode = 'EDIT';
        selectedId = id;
        // 1.เราจะดึงข้อมูล user ที่ต้องการแก้ไขออกมา
        try {
            const response = await axios.get('${BASE_URL}/users/${id}');
            const user = response.data;
            console.log('response', response.data);

            let firstNameDOM = document.querySelector('input[name = firstname]');
            let lastNameDOM = document.querySelector('input[name =lastname]');
            let ageDOM = document.querySelector('input[name =age]');
            let descriptionDOM = document.querySelector('textarea[name=description]');

            let genderDOMs = document.querySelectorAll('input[name= gender]');
            let interestDOMs = document.querySelectorAll('input[name=interest]');
            console.log('interest', user.interests);

            for (let i = 0; i < genderDOMs.length; i++) {
                if (genderDOMs[i].value == user.gender) {
                    genderDOMs[i].checked = true;
                }
            }

            for (let i = 0; i < interestDOMs.length; i++) {
                if (user.interests.includes(interestDOMs[i].value)) {
                    interestDOMs[i].checked = true;
                }
            }

            firstNameDOM.value = user.firstname;
            lastNameDOM.value = user.lastname;
            ageDOM.value = user.age;
            descriptionDOM.value = user.description;

        } catch (error) {
            console.log('error', error);
        }
        // 2.นำข้อมูล user ที่ดึงมาใส่ใน input
    }
}

const validateData = (userData) => {
    let errors = [];

    if (!userData.firstname) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastname) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    } else if (isNaN(userData.age)) {
        errors.push('อายุต้องเป็นตัวเลข');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests || userData.interests.length === 0) { // แก้ไขการตรวจสอบความสนใจ
        errors.push('กรุณาเลือกความสนใจ');
    }
    if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย');
    }
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name = firstname]');
    let lastNameDOM = document.querySelector('input[name =lastname]');
    let ageDOM = document.querySelector('input[name =age]');
    let genderDOMs = document.querySelector('input[name= gender]:checked');
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked');
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let messageDOM = document.querySelector('.message');

    try {
        let interest = '';
        if (interestDOMs && interestDOMs.length > 0) { // ตรวจสอบว่ามี interests ถูกเลือกหรือไม่
            for (let i = 0; i < interestDOMs.length; i++) {
                interest += interestDOMs[i].value;
                if (i !== interestDOMs.length - 1) {
                    interest += ',';
                }
            }
        }

        let userData = {
            firstname: firstNameDOM.value,
            lastname: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM ? genderDOM.value : '', // ตรวจสอบ genderDOM ก่อนใช้ .value
            description: descriptionDOM.value,
            interests: interest
        };

        console.log('submit Data', userData);
        const errors = validateData(userData);

        if (errors.length > 0) {
            //มี error
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }
        let message = 'บันทึกข้อมูลเรียบร้อย';

        if (mode == 'CREATE') {
            const response = await axios.post('${BASE_URL}/users', userData);
            console.log('response', response.data);
        } else {
            const response = await axios.put('${BASE_URL}/users/${selectedId}', userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }

        
        messageDOM.innerText = message;
        messageDOM.className = 'message success';
    } catch (error) {
        console.log('error message', error.message);
        console.log('error ', error.errors);

        if (error.response) {
            console.log(error.response);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        let htmlData = '<div>';
        htmlData += `<div> ${error.message} </div>`;
        htmlData += '<ul>';
        if (error.errors) { // ตรวจสอบว่า error.errors มีอยู่หรือไม่
            for (let i = 0; i < error.errors.length; i++) {
                htmlData += `<li> ${error.errors[i]} </li>`;
            }
        }
        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};