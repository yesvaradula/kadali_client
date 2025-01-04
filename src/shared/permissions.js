import React from 'react'

const pages = ['all']
function RunPermissions() {
    const {role} = JSON.parse(localStorage.getItem("user"));
    console.log(role)
    switch(role.toLowerCase()) {
        case 'manager': {
            pages.length = 0;
            pages.push('products')
            pages.push('_products_add');
            pages.push('_products_list')
        }
    }
}
 
RunPermissions()
export default pages