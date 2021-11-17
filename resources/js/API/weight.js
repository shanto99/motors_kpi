import axios from "axios";

const assignWeights = function (weights, userId) {
    console.log(weights);
    console.log(userId);
    return new Promise(function (resolve, reject) {
        axios.post('/motors_kpi/assign_weights', {
            userId: userId,
            weights: weights
        }).then(function (res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
}

const getWeights = function(userId) {
    return new Promise(function (resolve, reject) {
        axios.get(`/motors_kpi/get_weights/${userId}`).then(function (res) {
            resolve(res.data);
        }).catch(function (err) {
            if(reject) {
                reject(err);
            }
        });
    });
}

export {assignWeights, getWeights};
