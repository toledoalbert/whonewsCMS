angular.module('hunews.directives.articleItem', [])
	.directive('articleItem', function() {
		return {
			restrict: 'E',
			scope: {
				article: '=',
				loadArticles: '=',
				editArticle: '='
			},
			templateUrl: 'app/directives/article-item/article-item.html',
			controller: function($scope) {
				$scope.editThis = $scope.editArticle;
				$scope.title = $scope.article.title;
				$scope.visible = $scope.article.visible;

				$scope.showHideArticle = function(value) {

					var query = new Parse.Query("Article");

			        query.get($scope.article.id, {

			          success: function(article) {

			            // The object was retrieved successfully.
			            article.set("visible", value);
			            article.save();
			            article.save(null, {

			              success: function(art) {
			              	$scope.loadArticles();
			              }

			            });

			          },
			          error: function(object, error) {
			            // The object was not retrieved successfully.
			            // error is a Parse.Error with an error code and message.
			            console.log("Error occured: " + error.message);
			          }
			        });
				};
			}
		}
	});