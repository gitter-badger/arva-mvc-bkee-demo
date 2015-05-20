/**
 * Created by mysim1 on 21/04/15.
 */


import {Controller}         from 'arva-mvc/core/Controller';
import GameContext          from '../utils/GameContext';
import {GetDefaultContext}  from 'arva-mvc/DefaultContext';
import Player               from '../models/Player';
import ProfileView          from '../views/Profile/ProfileView';

import {HomeController}     from './HomeController';

export class ProfileController extends Controller {

    constructor(router, context) {
        super(router, context);

        this.gameContext = GetDefaultContext().get(GameContext);
    }


    /**
     * Register as new Player
     * @constructor
     */
    async Register() {
        let newPlayer = { id: undefined };
        let newPlayerName = this.gameContext.getDefaultPlayerName();

        await this.gameContext.ready('avatars');

        if (this.gameContext.isNewPlayer()) {

            newPlayer = new Player(null, {
                    name: newPlayerName,
                    lost: 0,
                    won: 0,
                    draw: 0,
                    score: 0,
                    lastTimeAccessed: Date.now(),
                    avatar: this.gameContext.avatars[0].url
            });
            this.gameContext.players.add(newPlayer);
            this.gameContext.setPlayerId(newPlayer.id);
        }

        this.router.go(this, 'Show', {playerId: newPlayer.id});
    }

    /**
     * Show Player
     * @param playerId
     * @constructor
     */
    async Show(playerId) {
        if (!playerId) this.router.go(HomeController, 'Main');
        else {
            let playerToShow = new Player(playerId);
            await this._FireOnceAndWait(playerToShow);

            let profileView = new ProfileView({
                dataSource: playerToShow
            });

            profileView._renderables.name.on('change', function() {
                playerToShow.name = this.value;
            });

            return profileView;
        }

    }


    _FireOnceAndWait(object) {
        return new Promise(function(resolve){
            object.once('ready', function() {
                resolve();
            });
        });
    }

}
