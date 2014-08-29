## avoscloud ![release](http://img.shields.io/github/release/turingou/avoscloud.svg?style=flat)&nbsp;![npm](http://img.shields.io/npm/v/angular-avoscloud.svg?style=flat)

a avoscloud service module based on Angular.js and ngResource.

### Installation
```bash
$ bower install avoscloud --save
```

### Example
html part:
```html
<html>
  <head>
    <script src="bower_components/angular/angular.min.js"></script>
    <script src="bower_components/angular-resource/angular-resource.min.js"></script>
    <script src="dist/avoscloud.min.js"></script>
  </head>
  <body ng-app="app">
    <div id="demo" ng-controller="basic">
      <button ng-click="createFoo();">Create A `foo` Object</button>
    </div>
  </body>
</html>
```

javascript part:

```javascript
angular
  .module('app', ['avoscloud'])
  .config(['avoscloudProvider',function(avoscloudProvider) {
    avoscloudProvider.config({
      'X-AVOSCloud-Application-Id': 'xxxxxxx',
      'X-AVOSCloud-Application-Key': 'xxxxxxx'
    });
  }])
  .controller('basic', ['avoscloud', function(avoscloud) {
    console.log(avoscloud);
    $scope.createFoo = function() {
      var myclass = new avoscloud.classes();
      myclass.foo = 'bar';
      myclass.$save({
        className: 'foo'
      });
    }
  }]);
```

### Contributing
- Fork this repo
- Clone your repo
- Install dependencies
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Open a pull request, and enjoy <3

### MIT license
Copyright (c) 2014 turing &lt;o.u.turing@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the &quot;Software&quot;), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

---
![docor](https://cdn1.iconfinder.com/data/icons/windows8_icons_iconpharm/26/doctor.png)
built upon love by [docor](https://github.com/turingou/docor.git) v0.1.3