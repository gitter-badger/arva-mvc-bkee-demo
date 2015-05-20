/**
 * Created by mysim1 on 17/05/15.
 */

import Player           from '../models/Player';
import Players          from '../collections/Players';
import Games            from '../collections/Games';
import Avatars          from '../collections/Avatars';

const BKEE_PLAYERID = 'bkee.playerid';

export default class GameContext {

    constructor() {
        this.players = new Players();
        this.avatars = new Avatars();
        this.games = new Games();
    }

    ready(what) {

        return new Promise(function(resolve) {
            this[what].once('ready', function() {
                resolve();
            });
        }.bind(this));
    }


    isNewPlayer() {
        if (localStorage[BKEE_PLAYERID]) return false;
        return true;
    }

    getPlayerId() {
        if (localStorage[BKEE_PLAYERID]) return localStorage[BKEE_PLAYERID];
        return undefined;
    }

    setPlayerId(playerId) {
        localStorage[BKEE_PLAYERID] = playerId;
    }

    getDefaultPlayerName() {
        return `player-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    }



    trackOnline() {
        setInterval(()=> {
            if (this.isNewPlayer()) return; // Wait until we are actually a new user
            let playerName = this.getPlayerId();

            let online = new Player(playerName);
            online.once('ready', function () {
                online.lastTimeAccessed = Date.now();
            }, this);

        }, 5000);
    }
}
