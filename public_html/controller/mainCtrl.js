angular.module('fileUpload', ['ngFileUpload'])
        .controller('MyCtrl', MyCtrl);

        function MyCtrl($http, $scope){

            var imageId = "5972f05aaa1b8f66ce227d0b";
            $http.get('http://localhost:4000/image/' + imageId).then(function(res) {
                if(res) {
                    $scope.imageData = res;
                }

            }).catch(function(err) {
            console.log("err", err);
        
            });
        };