import axios from "axios";

const assignWeights = function (weights) {
    return new Promise(function (resolve, reject) {
        axios.post('/motors_kpi/assign_weights', {
            weights: weights
        }).then(function (res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
}

export {assignWeights};
