System.register(['sapps.core.api'], function (_export) {
    'use strict';

    var IHttpConnection;

    _export('start', start);

    _export('stop', stop);

    function start(ctx) {
        ctx.services.register(IHttpConnection, {
            get: fetch
        });
    }

    function stop(ctx) {}

    return {
        setters: [function (_sappsCoreApi) {
            IHttpConnection = _sappsCoreApi.IHttpConnection;
        }],
        execute: function () {}
    };
});