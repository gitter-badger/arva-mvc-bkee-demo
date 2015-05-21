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
        super();

        if (!localStorage[BKEE_ACTIVEGAMES])
            localStorage[BKEE_ACTIVEGAMES] = JSON.stringify({});


        let ds = GetDefaultContext().get(DataSource);

        this.players = new Players();
        this.avatars = new Avatars();

        // my invites
        this.invites = new Invites(ds.child('Invites').child(this.getPlayerId()));


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
        return localStorage[BKEE_LASTGAMEID];
    }

    setLastActiveGame(gameid) {
        localStorage[BKEE_LASTGAMEID] = gameid;
    }


    invitePlayer(playerId) {
        let invitation = new Invite(null, {
            player1: this.getPlayerId(),
            player2: playerId,
            progressState: 'invited',
            gameState: []
        });
    }

    async rejectInvite(inviteId) {

        let invitation = new Invite(inviteId);
        delete invitation;
    }

    async acceptGame(inviteId) {

        let invitation = new Invite(inviteId);
        await FireOnceAndWait(invitation);

        let dice = (Math.random()*10)+1;
        let newGame = new Game(inviteId);
        await FireOnceAndWait(newGame);
        newGame.status = 'active';
        newGame.activeSince = Date.now();
        newGame.nextPlayer = dice>5?invitation.player1:invitation.player2;

        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
        games[invitation.from] = newGame.id;

        delete invitation;
    }

    async endGame(gameId, winner) {

        let game = new Game(gameId);
        await FireOnceAndWait(game);
        game.winner = winner;

        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
        delete games[invitation.from];
    }



    hasGame(playerId) {
        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
        return games[playerId]!=null;
    }



    getGameId(playerId) {
        let games = JSON.parse(localStorage[BKEE_ACTIVEGAMES]);
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
