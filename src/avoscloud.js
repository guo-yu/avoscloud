;(function(window, angular, NProgress) {
  'use strict';

  if (!angular)
    throw new Error('avoscloud.init(); angular.js required.');

  var NProgressExist = NProgress && NProgress.start && NProgress.done;

  // Inject as a angular module
  angular
    .module('avoscloud', ['ngResource'])    
    .constant('AVOSCLOUD_CONFIGS', configsConstants)
    .provider('avoscloud', ['$resource', '$httpProvider','AVOSCLOUD_CONFIGS', avoscloud]);

  function avoscloud(resource, $httpProvider, defautConfigs) {
    // Init configs
    this.configs = defautConfigs;

    // Use X-Domain to request cross domain
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Id'] = this.configs.appId ? 
      this.configs.appId :
      this.configs['X-AVOSCloud-Application-Id'];
    $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Key'] = this.configs.appKey ? 
      this.configs.appKey :
      this.configs['X-AVOSCloud-Application-Key'];
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Init SDK exports
    this.$get = function() {
      return initSDK(this);
    };
    
    // Custom configs function
    this.config = function(configs) {
      if (!configs || !angular.isObject(configs))
        return;
      var self = this;
      angular.forEach(configs, function(v, k){
        self.configs[k] = v;
      });
      this.configs = joinHost(this.configs);
      return this.configs;
    }

    // init SDK
    function initSDK(self) {
      var apiList = []
      var sdk = {};
      angular.forEach(apiList, function(item){
        sdk[item] = $resource(self.configs.host + item);
      });
      return sdk;
    }
  }

  function configsConstants() {
    var defaults = {
      protocol: 'https',
      apiversion: 1.1
      hostname: 'cn.avoscloud.com'
    };
    return joinHost(defaults);
  }

  function joinHost(obj) {
    obj.host = obj.protocol + 
    '://' + 
    obj.hostname + 
    '/' + 
    obj.apiversion + 
    '/';
    return obj;
  }

})(window, window.angular, window.NProgress);
