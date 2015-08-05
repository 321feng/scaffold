angular.module '{module}'
.directive '{directive}', () ->
  return {
    restrict: 'E',
    replace: true,
    link: (scope, element, attrs) ->

    template: '<div></div>'
  };
