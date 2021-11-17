import axios from "axios";

const getAllUsers = function() {
    return new Promise(function (resolve, reject) {
       axios.get('/motors_kpi/users').then(function(res) {
          resolve(res.data);
       }).catch(function(err) {
           if(reject) reject(err);
       });
    });
};

const createUser = function(userId, userName, designation, email, password, supervisor) {
    return new Promise(function (resolve, reject) {
        axios.post('/motors_kpi/create_user', {
            UserID: userId === "" ? null : userId,
            UserName: userName === "" ? null : userName,
            Designation: designation === "" ? null : designation,
            Email: email === "" ? null : email,
            Password: password === "" ? null : password,
            Supervisor: supervisor === "" ? null : supervisor
        }).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) reject(err);
        });
    });
};

const getUsersWithPagination = function(currentPage, pagination, search) {
    return new Promise(function(resolve, reject) {
        axios.get(`/motors_kpi/users_with_pagination/${currentPage}/${pagination}/${search}`).then(function(res) {
            console.log(res);
            resolve({
                data: res.data.data,
                page: currentPage-1,
                totalCount: res.data.total_count
            });
        }).catch(function(err) {
            reject(err);
        });
    })
}


export {getAllUsers, createUser, getUsersWithPagination};
