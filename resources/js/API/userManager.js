import axios from "axios";
import { formatRFC3339 } from "date-fns";

const getAllUsers = function() {
    return new Promise(function (resolve, reject) {
       axios.get('/motors_kpi/users').then(function(res) {
           let users = res.data && res.data.users || [];
            users = users.map(user => {
                let clonedUser = {...user};
                if(user.supervisors && user.supervisors.length > 0) {
                    clonedUser.supervisor = user.supervisors[0].supervisor;
                } 
                delete clonedUser.supervisors;
                return clonedUser;
            });
          resolve({users: users});
       }).catch(function(err) {
           if(reject) reject(err);
       });
    });
};

const createUser = function(userId, userName, designation, email, phone, portfolio, location, password, sign, supervisor) {
    return new Promise(function (resolve, reject) {

        const formData = new FormData();
        formData.append("UserID", userId);
        formData.append("UserName", userName);
        formData.append("Designation", designation);
        formData.append("Email", email);
        formData.append("Phone", phone);
        formData.append("Portfolio", portfolio);
        formData.append("Location", location);
        formData.append("Password", password);
        formData.append("Supervisor", supervisor);
        formData.append("Signature", sign);

        axios.post('/motors_kpi/create_user', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
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
            let users = res.data.data || [];
            users = users.map(user => {
                let clonedUser = {...user};
                if(user.supervisors && user.supervisors.length > 0) {
                    clonedUser.supervisor = user.supervisors[0].supervisor;
                } 
                delete clonedUser.supervisors;
                return clonedUser;
            });
            resolve({
                data: users,
                page: currentPage-1,
                totalCount: res.data.total_count
            });
        }).catch(function(err) {
            reject(err);
        });
    })
}

const getUserCriteria = function(userId) {
    return new Promise(function(resolve, reject) {
        let url = '/motors_kpi/get_criteria';
        if(userId) url = url+`/${userId}`;

        axios.get(url).then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) {
                reject(err);
            }
        });
    })
}


const getSubordinats = function() {
    return new Promise(function(resolve, reject) {
        axios.get('/motors_kpi/get_subordinates').then(function(res) {
            resolve(res.data);
        }).catch(function(err) {
            if(reject) {
                reject(err);
            }
        });
    });
}


export {getAllUsers, createUser, getUsersWithPagination, getUserCriteria, getSubordinats};
