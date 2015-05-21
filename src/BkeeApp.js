/**
 * Created by mysim1 on 20/04/15.
 */

import {Inject}                 from 'di.js';
import {App}                    from 'arva-mvc/core/App';
import Router                   from 'arva-mvc/core/Router';
import Context                  from 'famous/core/Context';
import {DataSource}             from 'arva-ds/core/DataSource';
import {GetDefaultContext}      from 'arva-mvc/DefaultContext';

import Navigation               from './views/Shared/Navigation';
import GameContext              from './utils/GameContext';
import Invite                   from './models/Invite';
import Invites                  from './collections/Invites';

import {HomeController}         from './controllers/HomeController';
import {PlayController}         from './controllers/PlayController';
import {ProfileController}      from './controllers/ProfileController';


@Inject(Router, Context, HomeController, PlayController, ProfileController)
export class BkeeApp extends App {


    constructor(router, context) {
        // make one of the controllers default
        router.setDefault(HomeController, 'Main');
        super(router);

        this.gameContext = GetDefaultContext().get(GameContext);

        // add a navigation component for the application
        let navigation = new Navigation();
        navigation._renderables.tabBar.on('tabchange', (event) =>{
            switch (event.index)
            {
                case 0: /* Invite Players */
                    this.router.go(HomeController, 'Main');
                    break;

                case 1: /* Current Game View */
                    this.router.go(PlayController, 'Main');
                    break;

                case 2: /* Profile */
                    let playerId = this.gameContext.getPlayerId();
                    if (playerId) this.router.go(ProfileController, 'Show', {playerId: playerId});
                    else this.router.go(ProfileController, 'Register');
                    break;
            }
        });

        context.add(navigation);


        this.setup();

    }

    setup() {
        // keep pulse to online
        this.gameContext.trackOnline();

        // set myself as active user

        // watch my invites scope
        var ds = GetDefaultContext().get(DataSource);
        var inviteScope = ds.child('Invites')
            .child(this.gameContext.getPlayerId());
        this.invites = new Invites(inviteScope);

        this.invites.on('child_added', function(child) {
            console.log('Invite received');
        });

    }
}

