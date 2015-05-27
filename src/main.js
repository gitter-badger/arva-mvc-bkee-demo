/**
 * Created by mysim1 on 21/04/15.
 */

/**
 * Created by mysim1 on 19/03/15.
 */

import {Injector}                               from 'di.js';
import {ArvaRouter}                             from 'arva-mvc/routers/ArvaRouter';
import {BkeeApp}                                from './BkeeApp';
import {BkeeDataSource}                         from './settings';
import {DataSource}                             from 'arva-ds/core/DataSource';
import {reCreateDefaultContext}                 from 'arva-mvc/DefaultContext';
import GameContext                              from '../utils/GameContext';

let context = reCreateDefaultContext(ArvaRouter, BkeeDataSource, GameContext);

/* If there is a authorisation context. Have the DS initialize the auth context. */
if (localStorage["bkee.playertoken"]) {
    let dataSource = context.get(DataSource);
    let token = localStorage["bkee.playertoken"];

    dataSource.authWithCustomToken(token, function(error, authData) {
        if (error) {
            console.log(`Access not allowed.`);
        } else {
            console.log(`Authenticated.`);
        }
        context.get(BkeeApp);
    });
} else context.get(BkeeApp);


//let app = context.get(BkeeApp);


