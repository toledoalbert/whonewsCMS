angular.module('app')


.controller('MainController', ['$scope', '$state', function($scope, $state) {

    $scope.isNew = true;
    $scope.toBeSaved = false;

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
        $scope.isNew = false;

    };

    $scope.saveEdited = function() {

        if($scope.isNew) {

            var Article = Parse.Object.extend("Article");

            var newArticle = new Article();

            newArticle.setTitle($scope.editableTitle);
            newArticle.setContent($scope.editableContent);
            newArticle.save(null, {

              success: function(art) {

                $scope.loadArticles();
                $scope.isNew = false;
                $scope.editableId = newArticle.id;
                $scope.toBeSaved = false;

              }

            });

        } else {

            var query = new Parse.Query("Article");

            query.get($scope.editableId, {

              success: function(article) {

                // The object was retrieved successfully.
                article.set("title", $scope.editableTitle);
                article.set("content", $scope.editableContent);
                article.save(null, {

                  success: function(art) {

                    $scope.loadArticles();
                    $scope.toBeSaved = false;

                  }

                });

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

        if($scope.isNew) {

            var Article = Parse.Object.extend("Article");

            var newArticle = new Article();

            newArticle.setTitle($scope.editableTitle);
            newArticle.setContent($scope.editableContent);
            newArticle.setVisible(true);

            newArticle.save(null, {

              success: function(art) {

                $scope.loadArticles();
                $scope.isNew = false;
                $scope.editableId = newArticle.id;
                $scope.toBeSaved = false;

              }

            });

        } else {

            var query = new Parse.Query("Article");

            query.get($scope.editableId, {

              success: function(article) {

                // The object was retrieved successfully.
                article.set("title", $scope.editableTitle);
                article.set("content", $scope.editableContent);
                article.set("visible", true);
                article.save(null, {

                  success: function(art) {

                    $scope.loadArticles();
                    $scope.toBeSaved = false;

                  }

                });

              },
              error: function(object, error) {
                // The object was not retrieved successfully.
                // error is a Parse.Error with an error code and message.
                console.log("Error occured: " + error.message);
              }
            });
        }
    };

    $scope.newPost = function() {

        if($scope.toBeSaved) {
            var confirm = window.confirm("You are about to start a new article and you didn't save the post you are working on. Are you sure?");
            if (confirm == true) {
                $scope.editableId = "";
                $scope.editableContent = "";
                $scope.editableTitle = "";
                $scope.isNew = true;
            } else {
                console.log("New article canceled.");
            }
        }else {
            $scope.editableId = "";
            $scope.editableContent = "";
            $scope.editableTitle = "";
            $scope.isNew = true;
        }

    };

    $scope.$watch('editableTitle', function() {
        $scope.toBeSaved = true;
    });

    $scope.$watch('editableContent', function() {
        $scope.toBeSaved = true;
    });

}])