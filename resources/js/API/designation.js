import axios from "axios";

const createDesignation = function(designationName) {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/save_designation', {
            Designation: designationName
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        })
    });
}

const getAllDesignations = function()
{
    return new Promise(function(resolve, reject) {
        axios.get('/motors_kpi/designations').then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    })
    
}

export {createDesignation, getAllDesignations};