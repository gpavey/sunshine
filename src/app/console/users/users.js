angular.module( 'sunshine.users', [
        'ui.router',
        'ui.bootstrap'
    ])

    .config(function config( $stateProvider ) {

        $stateProvider.state( 'console.users', {
            url: '/users',
            views: {
                "console": {
                    //controller: 'DashBoardCtrl',
                    templateUrl: 'console/users/users.tpl.html'
                }
            },
            data:{ pageTitle: 'Administration - users', authorizedRoles: ['admin', 'editor', 'anonymous'] }
        });
    })

    .controller( 'UsersCtrl', function UsersCtrl( $scope ) {
        // This is simple a demo for UI Boostrap.

    })

;