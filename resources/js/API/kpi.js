import axios from "axios";
import { reject } from "lodash";

const filterOutSubSubCriteria = function(subCriteria) {
    let subSubCriterias = subCriteria.sub_sub_criterias;
    subSubCriterias = subSubCriterias.filter(function(subSubCriteria) {
        return !!subSubCriteria.Weight;
    });

    subCriteria.sub_sub_criterias = subSubCriterias;
    return subCriteria;
}

const filterOutSubCriteria = function(criteria) {
    let subCriterias = criteria.sub_criterias;
    subCriterias = subCriterias.filter(function(subCriteria) {
        let flag = false;
        if(subCriteria.Weight) {
            return true;
        } else {
            if(subCriteria.sub_sub_criterias && subCriteria.sub_sub_criterias.length > 0) {
                let subSubCriterias = subCriteria.sub_sub_criterias;
                for(let i=0; i<subSubCriterias.length; i++) {
                    if(subSubCriterias[i].Weight) {
                        flag = true;
                        break;
                    }
                }
            }
        }

        return flag;
    });

    subCriterias = subCriterias.map(function(subCriteria) {
        return filterOutSubSubCriteria(subCriteria);
    })

    criteria.sub_criterias = subCriterias;
    return criteria;
}

const filterOutUnassignedCriteria = function(criterias) {
    criterias = criterias.filter(function(criteria) {
        let criteriaFlag = false;
        if(criteria.Weight) {
            return true;
        } else {
            if(criteria.sub_criterias.length > 0) {
                let subCriterias = criteria.sub_criterias;
                subCriteriaLoop: for(let i=0; i<subCriterias.length; i++) {
                    let subCriteria = subCriterias[i];
                    if(subCriteria.Weight) {
                        criteriaFlag = true;
                        break;
                    } else {
                        if(subCriteria.sub_sub_criterias && subCriteria.sub_sub_criterias.length > 0) {
                            let subSubCriterias = subCriteria.sub_sub_criterias;
                            for(let i=0; i<subSubCriterias.length; i++) {
                                let subSubCriteria = subSubCriterias[i];
                                if(subSubCriteria.Weight) {
                                    criteriaFlag = true;
                                    break subCriteriaLoop;
                                }
                            }
                        } else {
                            criteriaFlag = false;
                        }
                    }
                }
            } else {
                criteriaFlag = false;
            }
        }

        return criteriaFlag;
    });

    criterias = criterias.map(function(criteria) {
        return filterOutSubCriteria(criteria);
    });

    return criterias;
}

const criteriaWithValue = function(criterias, targets) {

    const findTarget = function(criteriaId, subCriteriaId, subSubCriteriaId) {
        criteriaId = criteriaId ? criteriaId.toString() : null;
        subCriteriaId = subCriteriaId ? subCriteriaId.toString() : null;
        subSubCriteriaId = subSubCriteriaId ? subSubCriteriaId.toString() : null;

        return targets.find(function(target) {
            return target.CriteriaID === criteriaId && target.SubCriteriaID === subCriteriaId && target.SubSubCriteriaID === subSubCriteriaId;
        });
    }

    criterias.forEach(function(criteria, criteriaIndex) {
        const subCriterias = criteria.sub_criterias || [];
        if(subCriterias.length > 0) {
            subCriterias.forEach(function(subCriteria) {
                const subSubCriterias = subCriteria.sub_sub_criterias || [];
                if(subSubCriterias.length > 0) {
                    subSubCriterias.forEach(function(subSubCriteria) {
                        let target = findTarget(criteria.CriteriaID, subCriteria.SubCriteriaID, subSubCriteria.SubSubCriteriaID);
                        if(target) {
                            subSubCriteria['Target'] = target['Target'];
                            subSubCriteria['Weight'] = target['Weight'];
                            subSubCriteria['Actual'] = target['Actual'];
                            subSubCriteria['Unit'] = target['Unit'];
                            subSubCriteria['ChangedBySupervisor'] = target['ChangedBySupervisor'];
                        }
                    });
                } else {
                    let target = findTarget(criteria.CriteriaID, subCriteria.SubCriteriaID);
                    if(target) {
                        subCriteria['Target'] = target['Target'];
                        subCriteria['Weight'] = target['Weight'];
                        subCriteria['Actual'] = target['Actual'];
                        subCriteria['Target'] = target['Target'];
                        subCriteria['ChangedBySupervisor'] = target['ChangedBySupervisor'];
                    }
                }
            });
        } else {
            let target = findTarget(criteria.CriteriaID);
            if(target) {
                criteria['Target'] = target['Target'];
                criteria['Weight'] = target['Weight'];
                criteria['Actual'] = target['Actual'];
                criteria['Target'] = target['Target'];
                criteria['ChangedBySupervisor'] = target['ChangedBySupervisor'];
            }

        }

    });

    return filterOutUnassignedCriteria(criterias);
}

const getKpi = function(period) {
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/get_kpi/${period}`).then(function(res) {
            const response = res.data;
            const formattedCriteria = criteriaWithValue(response.criterias, response.targets);
            const approvals = response.approvals;
            const employee = response.employee;
            const remarks = response.remarks || [];
            const monthPlanId = response.monthPlanId;

            resolve({formattedCriteria, approvals, employee, remarks, monthPlanId});
        }).catch(function(err) {
            if(reject) reject(err);
        })
    })
}

const getKpiById = function(kpiId) {
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/get_kpi_by_id/${kpiId}`).then(function(res) {
            const response = res.data;
            const formattedCriteria = criteriaWithValue(response.criterias, response.targets);
            const approvals = response.approvals;
            const employee = response.employee;
            const remarks = response.remarks || [];
            const monthPlanId = response.monthPlanId;
            resolve({formattedCriteria, approvals, employee, remarks, monthPlanId});
        }).catch(function(err) {
            if(reject) reject(err);
        })
    })
}

const getUserKpiByPeriod = function(userId, period) {
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/get_user_kpi_by_period/${userId}/${period}`).then(function(res) {
            const response = res.data;
            if(!response.criterias) resolve(null);
            const formattedCriteria = criteriaWithValue(response.criterias, response.targets);
            const approvals = response.approvals;
            const employee = response.employee;
            const remarks = response.remarks || [];
            resolve({formattedCriteria, approvals, employee, remarks});
        }).catch(function(err) {
            if(reject) reject(err);
        })
    })
}

const approveKpi = function(kpiId, comment) {
    return new Promise(function(resolve, reject) {
        axios.post('/motors_kpi/approve_kpi', {
            kpiId: kpiId,
            comment: comment
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    })
}

const getReport = function(userId, from, to) {
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/report/${userId}/${from}/${to}`).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        })
    })

}

const generateKpiPdf = function(kpiId) {
    axios.get(`/motors_kpi/kpi_pdf/${kpiId}`, {
        responseType: 'blob'
    }).then(function(res) {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'kpi.pdf'); //or any other extension
        document.body.appendChild(link);
        link.click();
    }).catch(function(err) {
        if(reject) reject(err);
    });
}

export {getKpi, getKpiById, approveKpi, getUserKpiByPeriod, getReport, generateKpiPdf};
