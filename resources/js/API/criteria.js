import axios from "axios";

const getCriterias = function() {
    return new Promise(function (resolve, reject) {
       axios.get('/motors_kpi/criterias').then(function (res) {
          resolve(res.data);
       }).catch(function(err) {
           if(reject) reject(err);
       });
    });
};

const createCriteria = function(name, criteriaId, subCriteriaId) {
    criteriaId = criteriaId === "" ? null : criteriaId;
    subCriteriaId = subCriteriaId === "" ? null : subCriteriaId;

    return new Promise(function (resolve, reject) {
        axios.post('/motors_kpi/create_criteria', {
           Name: name,
           CriteriaID: criteriaId,
           SubCriteriaID: subCriteriaId
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
}

export {getCriterias, createCriteria};
