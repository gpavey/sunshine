angular.module( 'sunshine.home', [
        'ui.router'
    ])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
    .config(function config( $stateProvider ) {
        $stateProvider.state( 'home', {
            url: '/home',
            views: {
                "main": {
                    controller: 'HomeCtrl',
                    templateUrl: 'home/home.tpl.html'
                }
            },
            data:{ pageTitle: 'Home', authorizedRoles: ['anonymous'] }
        });
    })

    .controller( 'HomeCtrl', function HomeController( $scope, DepartmentList, $log ) {

        DepartmentList.get_adopted().then(function (data){
            $scope.dept_list =  data;
        });

    })

;

