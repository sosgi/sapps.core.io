System.register(['sapps.core.api'], function (_export) {
    'use strict';

    var IHttpConnection, Connection;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    _export('start', start);

    _export('stop', stop);

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        } else {
            var error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }

    function start(ctx) {
        ctx.services.register(IHttpConnection, new Connection());
    }

    function stop(ctx) {}

    return {
        setters: [function (_sappsCoreApi) {
            IHttpConnection = _sappsCoreApi.IHttpConnection;
        }],
        execute: function () {
            Connection = (function () {
                function Connection() {
                    _classCallCheck(this, Connection);
                }

                _createClass(Connection, [{
                    key: 'get',
                    value: function get(url, params) {
                        url = 'api/v1' + url + '.json';
                        return fetch(url).then(checkStatus).then(function (response) {
                            return response.json();
                        });
                    }
                }, {
                    key: 'post',
                    value: function post(url, params) {}
                }, {
                    key: 'head',
                    value: function head(url, params) {}
                }, {
                    key: 'delete',
                    value: function _delete(url, params) {}
                }, {
                    key: 'put',
                    value: function put(url, params) {}
                }]);

                return Connection;
            })();
        }
    };
});