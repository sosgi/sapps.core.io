System.register(['sapps.core.api'], function (_export) {
    'use strict';

    var IConnection, Connection, Manager;

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

    return {
        setters: [function (_sappsCoreApi) {
            IConnection = _sappsCoreApi.IConnection;
        }],
        execute: function () {
            Connection = (function (_IConnection) {
                function Connection(name, protocol) {
                    _classCallCheck(this, Connection);

                    _get(Object.getPrototypeOf(Connection.prototype), 'constructor', this).call(this);
                    var queue = {};

                    var fire = function fire(defers, method, data) {
                        for (var i = 0; i < defers.length; i++) {
                            defers[i][method](data);
                        }
                    };
                    var fireResolve = function fireResolve(name, data) {
                        fire(queue[name], 'resolve', data);
                        delete queue[name];
                    };
                    var fireReject = function fireReject(name, defers, data) {
                        fire(queue[name], 'reject', data);
                        delete queue[name];
                    };

                    this.send = function (method, params) {
                        var defer = sjs.defer();
                        var name = method + ':' + io.qs.encode(params);
                        if (name in queue) {
                            queue[name].push(defer);
                        } else {
                            queue[name] = [defer];
                            var error = function error(type, ex) {
                                log.error('<' + type + '>', ex);
                                fireReject(name);
                            };
                            protocol.send(method, params).then(function (response) {
                                response = response || '{}';
                                try {
                                    response = JSON.parse(response);
                                    if (response.status === 'success') {
                                        fireResolve(name, response.response);
                                    } else {
                                        fireReject(name, response.response);
                                    }
                                } catch (e) {
                                    log.exception(e);
                                    error('parse', e);
                                }
                            }, error);
                        }
                        return defer.promise;
                    };
                }

                _inherits(Connection, _IConnection);

                return Connection;
            })(IConnection);

            _export('Connection', Connection);

            Manager = (function () {
                function Manager(ctx) {
                    _classCallCheck(this, Manager);

                    this.connections = [];
                    this.ctx = ctx;

                    this.start();
                }

                _createClass(Manager, [{
                    key: '_prepareConnections',
                    value: function _prepareConnections() {
                        var config = this.ctx.getProperty('io');
                        for (var i = 0; i < config.connections.length; i++) {
                            var connection = config.connections[i];

                            if (connection.type in io.protocols) {
                                var protocol = io.protocols[connection.type];
                                var conn = new Connection(connection.name, protocol(connection.params));
                                this.connections.push(conn);
                            } else {
                                log.error('Not found protocol type: ' + connection.type);
                            }
                        }
                    }
                }, {
                    key: 'findConnection',
                    value: function findConnection(method) {
                        for (var i = 0; i < this._connections.length; i++) {
                            if (this._connections[i].match(method)) {
                                return this._connections[i];
                            }
                        }

                        return null;
                    }
                }, {
                    key: 'start',
                    value: function start() {
                        this._prepareConnections();
                        this.regs = [];
                        for (var i = 0; i < this.connections.length; i++) {
                            this.regs.push(this.ctx.services.register(api.Connection, this.connections[i]));
                        }
                    }
                }, {
                    key: 'stop',
                    value: function stop() {
                        for (var i = 0; i < this.regs.length; i++) {
                            this.regs[i].unregister();
                        }
                        this._connections = [];
                        delete this.pool;
                        delete this.reg;
                    }
                }]);

                return Manager;
            })();

            _export('Manager', Manager);
        }
    };
});