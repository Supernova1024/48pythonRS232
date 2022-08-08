myApp.factory('apiService',($http,authService,$window, $q)=>{
    let requests={};

    const baseUrl = "https://erud8.herokuapp.com";

     //sign up request
    requests.signUp =  (userData) =>{
        return $http.post('/signup', userData);
    }

    requests.checkToken = (token) =>{
        return $http.get('/checktoken?token=' + token, null);
    }

    //login requests
    requests.login=(loginData)=>{
        return $http.post('/login' , loginData);
    };

    //get logged in user
    requests.getUser = ()=>{
        if(authService.getToken()){
            return $http.get('/user/currentUser?token='+authService.getToken() , null);
        }else{
            return $q.reject({data:"User not authorized..."});
        }
    }

    //get all local users
    requests.getLocalUsers=(role)=>{
        return $http.get('/user/allusers/'+ role + '?token='+authService.getToken() , null);
    }
    //get all local users
    requests.getStudents=()=>{
        return $http.get('/user/allstudents?token='+authService.getToken() , null);
    }

    //get all local users
    requests.getallMembers=()=>{
        return $http.get('/user/allmembers?token='+authService.getToken() , null);
    }
    
    
    //reset password requests
    requests.forgotPasswordOtpSend=(userData)=>{
        return $http.post('/forgotpassword' , userData);
    };

    // check password
    requests.checkpassword = (data) => {
        return $http.post('/checkpassword' , data);
    };

    requests.verifySentOtp=(otp)=>{
        return $http.post('/verifyotp' , otp);
    };

    requests.resetPassword=(newPassword)=>{
        return $http.post('/resetpassword' , newPassword);
    };

    
    // request to delete an User by Admin
    requests.deleteUser =  (tid) =>{
        return $http.get('/user/delete/' + tid + '?token=' + authService.getToken());
    }

    
    // request to edit User
    requests.editUser =  (data)=> {
        return $http.put('/user/edit/' + data._id + '?token=' + authService.getToken(), data);
    }

    //requests to get the entire performances 
    requests.getallperformances =  () =>{
        return $http.get('/user/all/performances?token=' + authService.getToken());
    }

    //requests to print barcode
    requests.printTargets = (printtargetsData) =>{
        return $http.post('/printtargets', printtargetsData);
    }

    //requests to add event
    requests.addEvent = (event) =>{
        return $http.post('/addevent', event);
    }

    //requests to add discipline
    requests.addDiscipline = (discipline) =>{
        return $http.post('/adddiscipline', discipline);
    }

    //requests to get events
    requests.getEvents=()=>{
        return $http.get('/user/allevents?token='+authService.getToken() , null);
    }

    //requests to get diciplines
    requests.getDiciplines=(data)=>{
        return $http.get('/user/alldiciplines/' + data + '?token='+authService.getToken() , null);
    }

    //requests to delete event
    requests.delEvent = (eventnamedate) =>{
        return $http.post('/delevent', eventnamedate);
    }

    //requests to delete event
    requests.delDiscipline = (data) =>{
        console.log("--data-------", data)
        return $http.post('/deldiscipline', data);
    }

    return requests;

});
//end query service
//


