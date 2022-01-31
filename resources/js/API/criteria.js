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

const createCriteria = function(name, remarks, criteriaId, subCriteriaId, subSubCriteriaId, unit, isEditing) {
    criteriaId = criteriaId === "" ? null : criteriaId;
    subCriteriaId = subCriteriaId === "" ? null : subCriteriaId;

    return new Promise(function (resolve, reject) {
        axios.post('/motors_kpi/create_criteria', {
           Name: name,
           Remarks: remarks,
           CriteriaID: criteriaId,
           SubCriteriaID: subCriteriaId,
           SubSubCriteriaID: subSubCriteriaId,
           Unit: unit,
           IsEditing: isEditing
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
};

const getSubmittedCriteriaDetails = () => {
    return new Promise(function (resolve, reject) {
        axios.get('/motors_kpi/get_submitted_criteria_details').then(function(res) {
            resolve(res.data);
        }).then(function(err) {
           if(reject) reject(err);
        });
    });

};

const updateCriteriaRemarks = function (remarks, criteriaId, subCriteriaId, subSubCriteriaId) {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/update_remarks', {
            criteriaId: criteriaId,
            subCriteriaId: subCriteriaId === "" ? null : subCriteriaId,
            subSubCriteriaId: subSubCriteriaId === "" ? null : subSubCriteriaId,
            remarks: remarks === "" ? null : remarks
        }).then(function(res) {
            resolve(res.data);
        })
    });
}

export {getCriterias, createCriteria, getSubmittedCriteriaDetails, updateCriteriaRemarks};
