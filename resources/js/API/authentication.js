import axios from "axios";

const login = function(userId, password) {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/login', {
            UserID: userId,
            Password: password
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            reject(err);
        });
    })
}

export {login};
