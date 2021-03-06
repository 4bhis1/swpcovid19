app.controller('needycontroller',['$scope', '$rootScope', '$http', '$location', '$anchorScroll' , function($scope, $rootScope, $http, $location, $anchorScroll) {

    $scope.get_location_data = () => {
        const url = "https://api.postalpincode.in/pincode/";
        let pincode = $scope.pincode;
        if (pincode == "") {
            $scope.area = "Enter pincode";
            return;
        }
        $http.get("https://api.postalpincode.in/pincode/"+pincode).then(
            (response) => {

                if(!(response.data.length>0)){
                    alert("Invalid Pin code");
                    return;
                } 

                let status = response.data[0].Status;
                // console.log(status);

                if(status === "Success"){
                    let area = response.data[0].PostOffice[0].Name;
                    let district = response.data[0].PostOffice[0].District;
                    let region = response.data[0].PostOffice[0].Region;
                    let state = response.data[0].PostOffice[0].State;

                    $scope.area = area;
                    $scope.district = district;
                    $scope.region = region;
                    $scope.state = state;
                }else{
                    alert("Please Enter Valid Pin code");
                }
            },
            (error) => {
              console.log(error);
          }
          );
    };

    $scope.create_request=function(user_name,user_mobile,landmark,pincode,area,district,region,state,required_stuff,remark){
        $http({
            method : "POST",
            url : 'api/api_requests.php',
            data: {
                user_name:user_name,
                user_mobile:user_mobile,
                landmark:landmark,
                pincode:pincode,
                area:area,
                district:district,
                region:region, 
                state:state,
                required_stuff:required_stuff,
                remark:remark,
                action:"add_new_request"
            },
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then((data) => {
            $scope.message="";
            if (data.errors) {
                    alert('Error occured during Insertion :)');
                }else{
                    $scope.message= data.data;

                    if($scope.message.scalar=="All fields are required" || $scope.message.scalar=="undefined" || $scope.message.scalar=="Error occured"){
                        alert($scope.message.scalar);
                    }
                    else{
                        $scope.requestid = $scope.message;
                        $scope.otpform=true;
                    }
                }
            });
    }


    $scope.verify_user=function(otp,requestid){
        $http({
            method : "POST",
            url : 'api/api_requests.php',
            data: {
                otp:otp,
                requestid:requestid,
                action:"verify_user"
            },
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then((data) => {
            $scope.message="";
            if (data.errors) {
                alert("Error occured... please try again later :)");
            }else{
                $scope.message= data.data.scalar;

                console.log(data);

                console.log($scope.message)

                if($scope.message=="Request added successfully."){
                    alert($scope.message);
                    location.reload();
                }
                else{
                    alert($scope.message);
                }
            }
        });
    }

    $scope.search_requests=function(pincode,region){
        $scope.requestdetails="";
        $http.get("api/api_requests.php?action=fetch_requests_by_pincode&pincode="+pincode+"&region="+region)
        .then(function(requestdetails){

            // console.log(requestdetails.data.scalar);

            if (requestdetails.data.scalar=="No details found." || requestdetails.data.scalar=="All fields are required") {
                // alert(requestdetails.data.scalar);
                $scope.seekeravailable=false;
                $scope.seekernotavailable=true;
            } 
            else{
                $scope.requestdetails=requestdetails.data;
                $scope.filteredResult=$scope.requestdetails;
                $scope.seekeravailable=true;
                $scope.seekernotavailable=false;
            }
        });
    }

    $scope.stuffFilter = function(result) {
        var x = Object.values($scope.requestdetails);

        // var filterResult = [];

        // for (var i = 0; i < x.length; i++) {
        //     let element = x.filter(item => item.required_stuff === result);
        //     filterResult.push(element);
        // }

        var filterResult = x.filter(item => item.required_stuff === result);
        console.log(filterResult);

        if(filterResult.length === 0){
            alert("No Request Found of your selected choice");
            $scope.filteredResult = filterResult;
        }else{
            $scope.filteredResult = filterResult;
        }
    }

    $scope.like_modal=function(request_id){
        $('#likerequestmodel').modal('toggle'); 
        $scope.req_id = request_id;
    }

    $scope.dislike_modal=function(request_id){
        $('#dislikerequestmodel').modal('toggle'); 
        $scope.req_id = request_id;
    }

    $scope.like_request=function(requestId,donationid){
        $http({
            method : "POST",
            url : 'api/api_requests.php',
            data: {
                requestId:requestId,
                donationid:donationid,
                action:"like_request"
            },
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then((data) => {
            $scope.message="";
            if (data.errors) {
                alert("Error occured... please try again later :)");
            }else{
                $scope.message= data.data.scalar;

                console.log($scope.message)

                if($scope.message=="Request liked successfully."){
                    alert($scope.message);
                    // location.reload();
                }
                else{
                    alert($scope.message);
                }
            }
        });
    }

    $scope.dislike_request=function(requestId,donationid){
        $http({
            method : "POST",
            url : 'api/api_requests.php',
            data: {
                requestId:requestId,
                donationid:donationid,
                action:"dislike_request"
            },
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
        })
        .then((data) => {
            $scope.message="";
            if (data.errors) {
                alert("Error occured... please try again later :)");
            }else{
                $scope.message= data.data.scalar;

                console.log($scope.message)

                if($scope.message=="Request disliked successfully."){
                    alert($scope.message);
                    // location.reload();
                }
                else{
                    alert($scope.message);
                }
            }
        });
    }

}]);
