

/**
 * @ngdoc directive
 * @name angWeatherAppApp.directive:Konami
 * @description
 * # Konami Code
 */
// angular.module('lscsClientApp')
//   .directive('ngKonami', function () {
//     return {
//     link: function (scope, element, attrs) {
//       var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
//       var konami_index = 0;
//       $(document).keydown(function(e){
//             console.log('hihihihi');
//           if (e.keyCode === konami_keys[konami_index++]) {
//               if (konami_index === konami_keys.length) {
//                   $(document).unbind('keydown', arguments.callee);
//                   $.getScript('http://www.cornify.com/js/cornify.js',function(){
//                       cornify_add();
//                       $(document).keydown(cornify_add);
//                   }); 
//               }
//           } else {
//               konami_index = 0;
//           }
//       });
//     }
//   };
//   });

  //check to make sure that the browser can handle window.addEventListener


if (window.addEventListener) {
  //create the keys and konami variables
  var keys = [],
  konami = "38,38,40,40,37,39,37,39,66,65";

  //bind the keydown event to the Konami function
  window.addEventListener("keydown", function(e){
    //push the keycode to the 'keys' array
    console.log(e.keyCode);
    keys.push(e.keyCode);

    //and check to see if the user has entered the Konami code
    if (keys.toString().indexOf(konami) >= 0) {
      //do something such as:
      console.log('Konami');
      cornify_add();
        
      //and finally clean up the keys array
      keys = [];
    };
  }, true);
}