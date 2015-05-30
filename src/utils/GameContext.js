/**
 * Created by mysim1 on 17/05/15.
 */

import {GetDefaultContext} from 'arva-mvc/DefaultContext';
import {DataSource}        from 'arva-ds/core/DataSource';
import {FireOnceAndWait,
    AuthenticateWithToken} from './helpers';
import {ObjectHelper}      from 'arva-mvc/utils/objectHelper';
import _                   from 'lodash';

import Player              from '../models/Player';
import Players             from '../collections/Players';
import Avatars             from '../collections/Avatars';
import Game                from '../models/Game';
import Games               from '../collections/Games';
import Invites             from '../collections/Invites';
import Invite              from '../models/Invite';

const BKEE_PLAYERID = 'bkee.playerid';
const BKEE_PLAYERTOKEN = 'bkee.playertoken';
const BKEE_LASTGAMEID = 'bkee.lastgameid';

export default class GameContext {

    constructor() {


        this.players = new Players();
        this.avatars = new Avatars();
        this.games = new Games();

        this.ds = GetDefaultContext().get(DataSource);

        // my invites
        if (!this.isNewPlayer()) {
            this.invites = new Invites(this.ds.child('Invites').child(this.getPlayerId()));

            this.invites.on('child_added', (invite) => {

                if (window.confirm(`You are challenged by ${invite.player1}. Accept?`)) {
                    this.acceptGame(invite);
                }
                else {
                    this.rejectInvite(invite);
                }
            });
        }
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

    getPlayerToken() {
        if (localStorage[BKEE_PLAYERTOKEN]) return localStorage[BKEE_PLAYERTOKEN];
        return undefined;
    }

    setActivePlayer(playerId, token) {
        localStorage[BKEE_PLAYERTOKEN] = token;
        localStorage[BKEE_PLAYERID] = playerId;
    }

    getDefaultPlayerName() {
        return `player-${Math.floor(Math.random() * 100000)}`;
    }

    getLastActiveGame() {
        let gameId = localStorage[BKEE_LASTGAMEID];
        if (!gameId)return '';
        return gameId;
    }

    setLastActiveGame(gameid) {
        localStorage[BKEE_LASTGAMEID] = gameid;
    }


    invitePlayer(playerId) {

        let invitation = new Invite(null, {
            player1: this.getPlayerId(),
            player2: playerId
        }, {
            dataSource: this.ds.child('Invites').child(playerId)
        });

    }

    rejectInvite(invitation) {
        invitation.remove();
    }


    async acceptGame(invitation) {

        let player1 = new Player(invitation.player1);
        let player2 = new Player(invitation.player2);
        await FireOnceAndWait(player1);
        await FireOnceAndWait(player2);

        let dice = (Math.random()*10)+1;
        let newGame = new Game(null, {
            player1: _.merge(ObjectHelper.getEnumerableProperties(player1), {id: invitation.player1}),
            player2: _.merge(ObjectHelper.getEnumerableProperties(player2), {id: invitation.player2}),
            status: 'active',
            activeSince: Date.now(),
            nextPlayer: dice>5?invitation.player1:invitation.player2
        });

        invitation.remove();
    }


    setWinnerScore() {

        let winner = new Player(this.getPlayerId());
        winner.once('ready', function() {
            winner.won = winner.won + 1;
            winner.score = winner.score + 3;
        });
    }

    setDrawScore() {
        let winner = new Player(this.getPlayerId());
        winner.once('ready', function() {
            winner.draw = winner.draw + 1;
            winner.score = winner.score + 2;
        });
    }


    setLossScore() {
        let winner = new Player(this.getPlayerId());
        winner.once('ready', function() {
            winner.lost = winner.lost + 1;
        });
    }


    trackOnline() {
        setInterval(()=> {
            return;
            if (this.isNewPlayer()) return; // Wait until we are actually a new user
            let playerName = this.getPlayerId();

            let online = new Player(playerName);
            online.once('ready', function () {
                online.lastTimeAccessed = Date.now();
            }, this);

        }, 5000);
    }
}
