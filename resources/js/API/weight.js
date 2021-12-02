import axios from "axios";

const assignWeights = function (weights, designationId) {
    return new Promise(function (resolve, reject) {
        axios.post('/motors_kpi/assign_weights_to_designation', {
            designationId: designationId,
            weights: weights
        }).then(function (res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
}

const getWeights = function(designationId) {
    return new Promise(function (resolve, reject) {
        axios.get(`/motors_kpi/get_weights/${designationId}`).then(function (res) {
            resolve(res.data);
        }).catch(function (err) {
            if(reject) {
                reject(err);
            }
        });
    });
}

export {assignWeights, getWeights};
