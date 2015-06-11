import {IHttpConnection} from 'sapps.core.api';

export function start(ctx){
    ctx.services.register(IHttpConnection, {
        get:fetch
    });
}

export function stop(ctx){
}