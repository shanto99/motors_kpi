import axios from "axios";

const setTargets = (targets) => {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/post_targets', {
        targets: targets
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) {
                reject(err);
            }
        });
    });
}

export {setTargets};