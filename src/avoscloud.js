;(function(window, angular, NProgress) {
  'use strict';

  if (!angular)
    throw new Error('avoscloud.init(); angular.js required.');

  var NProgressExist = NProgress && NProgress.start && NProgress.done;

  // Inject as a angular module
  angular
    .module('avoscloud', ['ngResource'])
    .constant('AVOSCLOUD_CONFIGS', initDefaultConfigs())
    .provider('avoscloud', ['$httpProvider', 'AVOSCLOUD_CONFIGS', avoscloud]);

  function avoscloud($httpProvider, defautConfigs) {
    // Init configs
    this.configs = defautConfigs;

    // Use X-Domain to request cross domain
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    // Init SDK exports
    this.$get = ['$resource', function($resource) {
      return initSDK($resource, this);
    }];

    // Custom configs function
    this.config = function(configs) {
      if (!configs || !angular.isObject(configs))
        return;
      var self = this;
      angular.forEach(configs, function(v, k) {
        self.configs[k] = v;
      });
      this.configs = joinHost(this.configs);

      $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Id'] = this.configs.appId ?
        this.configs.appId :
        this.configs['X-AVOSCloud-Application-Id'];
      $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Key'] = this.configs.appKey ?
        this.configs.appKey :
        this.configs['X-AVOSCloud-Application-Key'];

      return this.configs;
    }
  }

  // init SDK
  function initSDK($resource, self) {
    var apiMap = {
      'login': 'login',
      'signin': 'login', // alias
      'push': 'push',
      'sms': 'requestSmsCode', // alias
      'msg': 'requestSmsCode', // alias
      'rtm': 'rtm/messages/logs',
      'functions': 'functions',
      'feedback': 'feedback',
      'requestPasswordReset': 'requestPasswordReset',
      'resetPassword': 'requestPasswordReset', // alias
      'requestEmailVerify': 'requestEmailVerify',
      'verifyEmail': 'requestEmailVerify', // alias
      'requestMobilePhoneVerify': 'requestMobilePhoneVerify',
      'verifyPhone': 'requestMobilePhoneVerify', // alias
      'requestLoginSmsCode': 'requestLoginSmsCode',
      'smsLogin': 'requestLoginSmsCode', // alias
      'requestSmsCode': 'requestSmsCode',
      'verifyMobilePhone': 'verifyMobilePhone/:code',
      'verifySmsCode': 'verifySmsCode/:code',
      'classes': 'classes/:className',
      'users': 'users/:objectId/:action',
      'roles': 'roles/:objectId',
      'installations': 'installations/:objectId',
      'stats': 'stats/:type'
    };

    // create `$resource` instance
    var sdk = {};
    angular.forEach(apiMap, function(endpoint, key) {
      var extraMethods = {
        'post': {
          method: 'POST'
        },
        'update': {
          method: 'PUT'
        },
        'put': {
          method: 'PUT'
        }
      };
      sdk[key] = $resource(
        self.configs.host + endpoint, null, extraMethods
      );
    });
    return sdk;
  }

  function initDefaultConfigs() {
    return joinHost({
      protocol: 'https',
      apiversion: 1.1,
      hostname: 'cn.avoscloud.com'
    });
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
