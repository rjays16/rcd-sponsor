export default {
}

export function formatDecimal(value, places) {
    return Number(value).toLocaleString("en", {
        minimumFractionDigits: places,
        maximumFractionDigits: places,
    });
}

export function createFormData(form, properties) {
    let formData = new FormData();

    if(properties === null) {
        Object.keys(form).forEach(key => formData.append(key, form[key]));
    } else {
        properties.map(property=>{
            formData.append(`${property}`, form[`${property}`]);
            formData.get(`${property}`);
        });
    }
    
    return formData;
}

export function disableButton(class_selector, flag) {
    jQuery(document).find(class_selector).prop('disabled', flag);
}