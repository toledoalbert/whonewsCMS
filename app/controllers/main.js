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

              var img = "";

              if(object.get('image')){
                img = object.get('image').url();
              }

              $scope.articles.push({
                title: object.get('title'),
                content: object.get('content'),
                visible: object.get('visible'),
                id: object.id,
                image: img
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
        $scope.editableImage = article.image;
        $('#image-drop').css('background', 'url(' + article.image + ') no-repeat');
        $scope.isNew = false;

    };

    $scope.saveEdited = function() {

        if($scope.isNew) {

            var Article = Parse.Object.extend("Article");

            var newArticle = new Article();

            newArticle.setTitle($scope.editableTitle);
            newArticle.setContent($scope.editableContent);
            newArticle.setImage($scope.editableImage);
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
                article.set("image", $scope.editableImage);
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

    var dropArea = $('#image-drop');

    $('*').on('dragover', function(e){
        e.stopPropagation();
        e.preventDefault();
    });

    $('*').on('drop', function(e){
        e.stopPropagation();
        e.preventDefault();
    });

    dropArea.on('dragenter', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).addClass('dragging');
        console.log('dragover');
    });

    dropArea.on('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    dropArea.on('dragleave', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).removeClass('dragging');
    });

    dropArea.on('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).removeClass('dragging');

        var file  = e.originalEvent.dataTransfer.files[0];

        var parseFile = new Parse.File(file.name, file, file.type);

        parseFile.save().then(function() {

            console.log('parse file saved');
          
            $scope.editableImage = parseFile;
            $scope.toBeSaved = true;
            dropArea.css('background', 'url(' + parseFile.url() + ') no-repeat');

        }, function(error) {
          alert('There was a problem uploading the file: ' + error.message);
        });

        console.log('dropped', file);
    });

    // $scope.imageDropped = function(){
    //     //Get the file
    //     var file = $scope.uploadedFile;

    //     //Upload the image
    //     //(Uploader is a service in my application, you will need to create your own)
    //     // Uploader.uploadImage(file).then(
    //     //     function(imageUrl){
    //     //         //Application-specific stuff...
    //     //     }
    //     // );

    //     // //Clear the uploaded file
    //     // $scope.uploadedFile = null;
    //     console.log("image dropped");
    // };

}])