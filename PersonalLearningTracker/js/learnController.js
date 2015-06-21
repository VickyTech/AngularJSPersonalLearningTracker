"use strict";

coursesApp.config(function ($routeProvider) {
    $routeProvider
            .when('/', {
                templateUrl: 'course-list.html',
                controller: 'CoursesController'
            })
            .when('/:app*', {
                templateUrl: 'courseDetail.html',
                controller: 'CoursesController'
            })
            .otherwise('/');
});


 coursesApp.factory('CoursesService', function($resource) {
    return {
        getAllApps: function() {

            return data;

        },
        getCoursesByApp: function (path) {
              for(var i in data){

                var appName=data[i].appName;
                   if(appName === path){
                    return data[i];
                }
            }

        }
    }
});

coursesApp.controller('CoursesController', function ($scope, $location, $routeParams, CoursesService,Storage) {

    $scope.courses=Storage.loadObject('courses');


        var path=$routeParams.app;

     $scope.coursedays=Storage.loadObject('coursedays'+path);
     $scope.storageSupport = Storage.supported();
     //alert($scope.coursedays.length);

    $scope.save = function() {
        //alert("save");
        Storage.saveObject($scope.courses,'courses');
        Storage.saveObject($scope.coursedays,'coursedays'+path);

        }

  $scope.clear = function() {
    Storage.clear();
    $scope.courses = [];
    $scope.coursedays=[];
    $scope.initForm();

  }
  $scope.initForm = function() {
      //alert("init form");
      $scope.addData();


  }
$scope.addData = function(){
     if(!$routeParams.app) {

           if($scope.courses.length<1){
            $scope.courses=CoursesService.getAllApps();

            }

         } else {
                if($scope.coursedays.length<1){
                    var courseData = {};
                   courseData= CoursesService.getCoursesByApp($routeParams.app);

                   for(var j in courseData.days){
          var dayCourses=courseData.days[j].links;

      for(var i in dayCourses){

          var status = dayCourses[i].status;
          //alert("productlink status:"+status);

     }

  }
                }
                $scope.coursedays=courseData.days;
                //alert("$scope.coursedays:"+$scope.coursedays.length);

      }
}
 $scope.showCourseDetails = function (course) {
        if (course['appName']) {
            var productByUrl = course['appName'];
            var shortUrl = productByUrl;
            return $location.path(shortUrl);
        }
    }
  $scope.initForm();

  $scope.calculateProgress=function(course){

      var completedCourses = 0;
      var totalCourses=0;
      var appName=course["appName"];
      //alert("appName:"+appName);

      var storageProducts = Storage.loadObject('coursedays'+appName);

      for(var j in storageProducts){
          var dayCourses=storageProducts[j].links;
      totalCourses+=dayCourses.length;
      for(var i in dayCourses){

          var status = dayCourses[i].status;
          //alert("productlink status:"+status);
         if(status){
             completedCourses=completedCourses+1;
         }
     }

  }
     //alert("completedCourses:"+completedCourses);
     if(totalCourses>0){
     return (completedCourses*100)/totalCourses;
    }else{
        return 0;
    }

  }


});

