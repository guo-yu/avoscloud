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
    $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Id'] = this.configs.appId ?
      this.configs.appId :
      this.configs['X-AVOSCloud-Application-Id'];
    $httpProvider.defaults.headers.common['X-AVOSCloud-Application-Key'] = this.configs.appKey ?
      this.configs.appKey :
      this.configs['X-AVOSCloud-Application-Key'];
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
      return this.configs;
    }
  }

  // init SDK
  function initSDK($resource, self) {
    var apiList = {
      'login': 'login',
      'signin': 'login', // alias
      'requestPasswordReset': 'requestPasswordReset',
      'resetPassword': 'requestPasswordReset', // alias
      'requestEmailVerify': 'requestEmailVerify',
      'verifyEmail': 'requestEmailVerify', // alias
      'requestMobilePhoneVerify': 'requestMobilePhoneVerify',
      'verifyPhone': 'requestMobilePhoneVerify', // alias
      'requestLoginSmsCode': 'requestLoginSmsCode',
      'smsLogin': 'requestLoginSmsCode', // alias
      'requestSmsCode': 'requestSmsCode',
      'sms': 'requestSmsCode', // alias
      'msg': 'requestSmsCode', // alias
      'push': 'push',
      'functions': 'functions',
      'feedback': 'feedback',
      'rtm': 'rtm/messages/logs',
      'verifyMobilePhone': {
        uri: '/:code',
        params: {
          code: '@code'
        }
      },
      'verifySmsCode': {
        uri: '/:code',
        params: {
          code: '@code'
        }
      },
      'classes': {
        uri: '/:className',
        params: {
          className: '@className'
        }
      },
      'users': {
        uri: '/:objectId/:action',
        params: {
          objectId: '@objectId',
          action: '@action'
        }
      },
      'roles': {
        uri: '/:objectId',
        params: {
          objectId: '@objectId'
        }
      },
      'installations': {
        uri: '/:objectId',
        params: {
          objectId: '@objectId'
        }
      },
      // stats/appinfo
      // stats/appmetrics
      'stats': {
        uri: '/:type',
        params: {
          type: '@type'
        }
      }
    };

    // create `$resource` instance
    var sdk = {};
    angular.forEach(apiList, function(params, key) {
      var url = angular.isObject(params) && params.uri ? 
        self.configs.host + key + params.uri :
        self.configs.host + params;

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
        url, 
        angular.isObject(params) ? params : {}, 
        extraMethods
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
