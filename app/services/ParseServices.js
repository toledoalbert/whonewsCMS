angular.module('ParseServices', [])
.factory('ParseSDK', function() {

  // pro-tip: swap these keys out for PROD keys automatically on deploy using grunt-replace
  Parse.initialize("G8DPvcKwFEOzkNe35jLPBdpmnbyVkOkhKWa1QrPr", "i8oIKGaRVjRVepLdI1drzApjmZIcR54Zob7sLlRV"); 

});