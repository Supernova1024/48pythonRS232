myApp.controller('dashController',['$http','$q','apiService','authService','$rootScope', '$location','$filter','$stateParams', function($http,$q,apiService,authService,$rootScope,$location,$filter, $stateParams){
	var dash = this;

	this.alltests = [];
	this.allmembers = [];
	this.alltestresults = [];

	this.Math = window.Math;

	//check whether the user is logged in
	this.loggedIn=()=>{
		if(authService.isLoggedIn()){
			return 1;
		}
		else{
			return 0;
		}
	};
	$rootScope.loading = false;
	//getting the user detail and checking whether the user is admin or not
	this.getUserDetail=()=>{
		if(authService.isLoggedIn()){
			apiService.getUser().then(function successCallBack(response){
				if(response.data.error){
					// alert("Authentication failed! Token Expired");
					dash.logout();
				}else{
					$rootScope.name=response.data.name;
					$rootScope.userID = response.data._id;
					$rootScope.email=response.data.email;
					$rootScope.user = response.data

					if (response.data.role == 'student') {
						$rootScope.role = 'Student';
						$rootScope.admin = false;						
					} else {
						if(response.data.role == 'administrator') {
							$rootScope.role = 'Administrator';
							$rootScope.admin = true;
							apiService.getallMembers().then(function successCallBack(response){
								console.log('here I am admin, too', response.data.data)
								dash.allmembers = response.data.data;
								$rootScope.memberArrayLength = dash.allmembers.length;
							},
							function errorCallback(response) {
								alert("some error occurred. Check the console.");
								console.log(response); 
							});
						} else {
							$rootScope.role = 'Member';
							$rootScope.admin = false;
						}
					}
				// dash.getalltests($rootScope.userID, $rootScope.role)
				}
			});
		}
	};

	this.getmembers = ()=>{
		$q.all([
			apiService.getLocalUsers('member')
			]).then(function(students) {
				var localusers=students[0].data.data;
				dash.allmembers = localusers;
			});
	};

	this.getadministrators = ()=>{
		$q.all([
			apiService.getLocalUsers('administrator')
			]).then(function(students) {
				var localusers=students[0].data.data;
				dash.alladmins = localusers;
			});
	};

	this.copyClip = (index)=>{
		console.log('here', index)
		var copyText = document.getElementById("myInput_" + index);

		/* Select the text field */
		copyText.select();
		copyText.setSelectionRange(0, 99999); /* For mobile devices */

		/* Copy the text inside the text field */
		document.execCommand("copy");

		/* Alert the copied text */
		// alert("Copied the text: " + copyText.value);
	}

	
	this.confirmDeleteMember = ()=>{
		$("#deleteUserModal").modal('hide');
		apiService.deleteUser(dash.uid).then(function successCallBack(response){
			console.log('dash.uindex', dash.uindex)
			dash.allmembers.splice(dash.uindex, 1);
			console.log('after dash.allmembers', dash.allmembers)
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}

	this.deleteMember = (uid, uindex)=>{
		dash.uid = uid;
		dash.uindex = uindex;
		$("#deleteUserModal").modal('show');
	}

	this.confirmDeleteStudent = ()=>{
		$("#deleteUserModal").modal('hide');
		apiService.deleteUser(dash.uid).then(function successCallBack(response){
			console.log('dash.uindex', dash.uindex)
			dash.allstudents.splice(dash.uindex, 1);
			console.log('after dash.allstudents', dash.allstudents)
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}

	this.deleteAdministrator = (uid, uindex)=>{
		dash.uid = uid;
		dash.uindex = uindex;
		$("#deleteUserModal").modal('show');
	}

	this.confirmDeleteAdministrator = ()=>{
		$("#deleteUserModal").modal('hide');
		apiService.deleteUser(dash.uid).then(function successCallBack(response){
			console.log('dash.uindex', dash.uindex)
			dash.alladmins.splice(dash.uindex, 1);
			console.log('after dash.alladmins', dash.alladmins)
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	}
	this.editMember = (user) => {
		$rootScope.selectedUser = user;
		$rootScope.selectedUser.firstname = user.name.split(" ")[0]
		$rootScope.selectedUser.lastname = user.name.split(" ")[1]
		$location.path('/dashboard/editmember/' + user._id);
	};

	this.editAdministrator = (user) => {
		$rootScope.selectedUser = user;
		$rootScope.selectedUser.firstname = user.name.split(" ")[0]
		$rootScope.selectedUser.lastname = user.name.split(" ")[1]
		$location.path('/dashboard/editadministrator/' + user._id);
	};

	this.editUsers = (role, new_user) => {
		console.log("======new_user=======", new_user)
		var dd = String(new_user.birthday.getDate()).padStart(2, '0');
		var mm = String(new_user.birthday.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = new_user.birthday.getFullYear();
		new_user.birthday = yyyy + '-' + mm + '-' + dd;
		apiService.editUser(new_user).then(function successCallBack(response){
			if (role == 'member') {
				$location.path('dashboard/view-members')
			} else if (role == 'administrator') {
				$location.path('dashboard/view-admins')
			} else {
				$location.path('dashboard/view-students')
			}
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});

	};


	this.saveprofile = (new_user)=> {
		console.log("new_user", new_user);
		apiService.editUser(new_user).then(function successCallBack(response){
			console.log("response.data", response.data)
			$rootScope.user = response.data;
			$("#editModal").modal('hide');
		},
		function errorCallback(response) {
			alert("some error occurred. Check the console.");
			console.log(response); 
		});
	};

	this.resetMessage = (message) => {
		if (message == 'mismatch') {
			dash.mismatch = false;
		} else {
			dash.current = false;
		}
	}

	this.changepassword = (pass) => {
		if (pass.new != pass.confirm) {
			dash.mismatch = true;
			dash.message = "Your password doesn't match.";
		} else if (typeof pass.new == 'undefined' || typeof pass.confirm == 'undefined') {
			dash.mismatch = true;
			dash.message = "Please fill out the fields.";
		} else {
			var data = {
				'userid': $rootScope.userID,
				'password': pass.current
			};
			apiService.checkpassword(data).then(function successCallBack(response){
				if (response.data.error == true) {
					dash.mismatch = true;
					dash.message = "Your password is wrong.";
				} else {
					console.log('now send the request to change the password.');
					var newPassword = {
						password: pass.new,
						cpassword: pass.confirm
					};
					apiService.resetPassword(newPassword).then(function successCallback(response){
						 console.log(response.data.message);
						 alert(response.data.message);
						 $("#changepassModal").modal('hide');
					},
					function errorCallback(response) {
						alert("some error occurred. Check the console.");
						console.log(response); 
					});
				};
			},
			function errorCallback(response) {
				alert("some error occurred. Check the console.");
				console.log(response); 
			});
		}
	}

	//function to logout the user
  	this.logout=()=>{
  		//clear the local storage
  		delete $rootScope.admin;
  		delete $rootScope.name;
  		authService.setToken();
  		$location.path('/login');
  	};

  	this.round_half_up=(n, decimals=0)=>{
	    multiplier = 10 ** decimals
    	return Math.floor(n*multiplier + 0.5) / multiplier
	};

	this.goAdminList=()=> {
		$location.path('/dashboard/view-admins');
	};

	this.goMemberList=()=> {
		$location.path('/dashboard/view-members');
	};
  }]);