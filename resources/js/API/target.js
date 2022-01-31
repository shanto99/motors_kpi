import axios from "axios";

const setTargets = (targets, period) => {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/post_targets', {
            targets: targets,
            period: period
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) {
                reject(err);
            }
        });
    });
}

const getTargets = function(period) {
    if(!period) {
        const today = new Date();
        period = `${today.getFullYear()}-${today.getMonth()+1}`;
    }
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/targets/${period}`).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    })
}

const getPendingTargets = function() {
    return new Promise(function(resolve, reject) {
        axios.get('/motors_kpi/get_pending_targets').then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    })
}

const getPlanDetail = function(planId) {
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/plan_details/${planId}`).then(res => {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
}

const inputActuals = (actuals, planId, remarks) => {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/post_actuals', {
            actuals: actuals,
            planId: planId,
            remarks: remarks
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) {
                reject(err);
            }
        });
    }); 
}

const approveTargets = (planId, targets) => {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/approve_targets', {
            planId: planId,
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

const getPendingKpis = function() {
    return new Promise(function(resolve, reject) {
        axios.get('/motors_kpi/get_pending_kpis').then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) {
                reject(err);
            }
        });
    });
}

export {setTargets, getTargets, inputActuals, getPendingTargets, getPlanDetail, approveTargets, getPendingKpis};