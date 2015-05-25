/**
 * Created by mysim1 on 17/05/15.
 */

import {GetDefaultContext} from 'arva-mvc/DefaultContext';
import {DataSource}        from 'arva-ds/core/DataSource';
import FireOnceAndWait     from './helpers';

import Player              from '../models/Player';
import Players             from '../collections/Players';
import Avatars             from '../collections/Avatars';
import Game                from '../models/Game';
import Invites             from '../collections/Invites';
import Invite              from '../models/Invite';

const BKEE_PLAYERID = 'bkee.playerid';
const BKEE_LASTGAMEID = 'bkee.lastgameid';
const BKEE_ACTIVEGAMES = 'bkee.activegames';

export default class GameContext {

    constructor() {

        //super();

        if (!localStorage[BKEE_ACTIVEGAMES])
            localStorage[BKEE_ACTIVEGAMES] = JSON.stringify({});


        this.ds = GetDefaultContext().get(DataSource);

        this.players = new Players();
        this.avatars = new Avatars();

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

    setPlayerId(playerId) {
        localStorage[BKEE_PLAYERID] = playerId;
    }

    getDefaultPlayerName() {
        return `player-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
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
            player1: player1,
            player2: player2,
            status: 'active',
            activeSince: Date.now(),
            nextPlayer: dice>5?invitation.player1:invitation.player2
        });

        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
        games[invitation.player1] = newGame.id;
        localStorage[BKEE_ACTIVEGAMES] = JSON.stringify(games);

        invitation.remove();
    }

    getActiveGames() {
        return localStorage[BKEE_ACTIVEGAMES];
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


    hasGame(playerId) {
        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
        return games[playerId]!=null;
    }



    getGameId(playerId) {
        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
        return games[playerId];
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
