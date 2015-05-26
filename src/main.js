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
import {reCreateDefaultContext}                 from 'arva-mvc/DefaultContext';
import GameContext                              from '../utils/GameContext';

reCreateDefaultContext(ArvaRouter, BkeeDataSource, GameContext)
    .get(BkeeApp);
