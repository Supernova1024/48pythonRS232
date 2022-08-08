myApp.config(['$stateProvider','$urlRouterProvider','$locationProvider', function($stateProvider,$urlRouterProvider,$locationProvider) {


    $stateProvider
    .state('main',{
        url:'/',
        templateUrl	: 'views/main.html'

    })
    .state('login',{
      url           :'/login/:token',
      templateUrl    : 'views/login.html',
      controller     : 'userController as userCtrl',
      resolve: {
        "check": function ($location,authService,$stateParams) {
            if (authService.getToken()) {

                $location.path('/dashboard');

            } else {
                $location.path('/login/'+ $stateParams.token);

            }
        }
    }

})

    .state('signup',{
        url            : '/signup/:token',
        templateUrl    : 'views/signup.html',
        controller     : 'userController as userCtrl'

    })
    .state('forgotpass',{
        url            : '/forgotpass',
        templateUrl    : 'views/forgot-pass.html',
        controller     : 'userController as userCtrl'

    })
    .state('dashboard',{
        url            : '/dashboard',
        templateUrl    : 'views/dashboard.html',
        controller     : 'dashController as dashCtrl',
        resolve: {
            "check": function ($location,authService) {
                if (authService.getToken()) {

                    $location.path('/dashboard/index');

                } else {
                    $location.path('/login');

                }
            }
        }
    })
    .state('dashboard.index',{
        url            : '/index',
        templateUrl    : 'views/index.html',
        controller     : 'dashController as dashCtrl'
    })
    .state('dashboard.addmember',{
        url            : '/addmember',
        templateUrl    : 'views/add-member.html',
        controller   : 'userController as userCtrl'     
    })
    .state('dashboard.targets',{
        url            : '/targets',
        templateUrl    : 'views/print-targets.html',
        controller   : 'userController as userCtrl'     
    })
    .state('dashboard.events',{
        url            : '/events',
        templateUrl    : 'views/manage-events.html',
        controller   : 'testController as testCtrl'     
    })
    .state('dashboard.addadmin',{
        url            : '/addadmin',
        templateUrl    : 'views/add-admin.html',
        controller   : 'userController as userCtrl'     
    })
    .state('dashboard.editmember',{
        url            : '/editmember/:uid',
        templateUrl    : 'views/edit-member.html',
        controller   : 'userController as userCtrl'     
    })
    .state('dashboard.editadministrator',{
        url            : '/editadministrator/:uid',
        templateUrl    : 'views/edit-administrator.html',
        controller   : 'userController as userCtrl'     
    })
    .state('dashboard.members',{
        url            : '/view-members',
        templateUrl    : 'views/view-members.html',
        controller   : 'testController as testCtrl'     
    })
    .state('dashboard.admins',{
        url            : '/view-admins',
        templateUrl    : 'views/view-admins.html',
        controller   : 'testController as testCtrl'     
    })
    .state('dashboard.allusers',{
        url            : '/allusers/:tid',
        templateUrl    : 'views/allusers.html',
        controller   : 'testController as testCtrl'  
    })

    .state('dashboard.userprofile',{
        url            : '/profile',
        templateUrl    : 'views/view-profile.html',
        controller   : 'dashController as dashCtrl'     
    })

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    
}]);