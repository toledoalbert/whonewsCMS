angular.module('app')


.controller('MainController', ['$scope', '$state', function($scope, $state) {

    $scope.isNew = true;

    $scope.loadArticles = function() {
        console.log("loading articles");
        // Queries
        var query = new Parse.Query("Article");

        query.descending("createdAt");

        query.find({

          success: function(results) {

            $scope.articles = [];

            // Do something with the returned Parse.Object values
            for (var i = 0; i < results.length; i++) { 

              var object = results[i];

              $scope.articles.push({
                title: object.get('title'),
                content: object.get('content'),
                visible: object.get('visible'),
                id: object.id
                });
            }
          },
          error: function(error) {
            console.log("Error: " + error.code + " " + error.message);
          }
        });
    };

    $scope.loadArticles();

    $scope.editThis = function(article) {

        console.log(article);
        $scope.editableTitle = article.title;
        $scope.editableContent = article.content;
        $scope.editableId = article.id;

    };

    $scope.saveEdited = function() {

        if($scope.isNew) {

            var Article = Parse.Object.extend("Article");

            var newArticle = new Article();

            newArticle.setTitle($scope.editableTitle);
            newArticle.setContent($scope.editableContent);
            newArticle.save();
            $scope.loadArticles();
            $scope.isNew = false;
            $scope.editableTitle = newArticle.getTitle();
            $scope.editableContent = newArticle.getContent();
            $scope.editableId = newArticle.id;

        } else {

            var query = new Parse.Query("Article");

            query.get($scope.editableId, {

              success: function(article) {

                // The object was retrieved successfully.
                article.set("title", $scope.editableTitle);
                article.set("content", $scope.editableContent);
                article.save();
                $scope.loadArticles();

              },
              error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                console.log("Error occured: " + error.message);
              }
            });
        }
    };

    $scope.publishEdited = function() {

        var query = new Parse.Query("Article");

        query.get($scope.editableId, {

          success: function(article) {

            $scope.saveEdited();

            // The object was retrieved successfully.
            article.set("visible", true);
            article.save();

          },
          error: function(object, error) {
            // The object was not retrieved successfully.
            // error is a Parse.Error with an error code and message.
            console.log("Error occured: " + error.message);
          }
        });
    }

}])