/**
 * Created by mysim1 on 21/04/15.
 */


import {Controller}         from 'arva-mvc/core/Controller';

import Game                 from '../models/Game';
import Invite               from '../models/Invite';

import Players              from '../collections/Players';
import GameContext          from '../utils/GameContext';
import {GetDefaultContext}  from 'arva-mvc/DefaultContext';
import {ProfileController}  from './ProfileController';
import {PlayController}     from './PlayController';

import InvitePlayerView     from '../views/Home/InvitePlayerView';
import MyGamesView          from '../views/Home/MyGamesView';

export class HomeController extends Controller {

    constructor(router, context) {
        super(router, context);

        this.gameContext = GetDefaultContext().get(GameContext);

        // views and databinding
        this.invitePlayerView = new InvitePlayerView({
            dataSource: this.gameContext.players,
            activePlayer: this.gameContext.getPlayerId()
        });

        this.myGamesView = new MyGamesView({
            dataSource: this.gameContext.games,
            activePlayer: this.gameContext.getPlayerId()
        });


        this.myGamesView.on('play', (game) => {
            this.router.go(PlayController, 'Play', { gameId: game.id});
        });


        this.myGamesView.on('invite', () => {
            this.router.go(this, 'InvitePlayers');
        });


        this.invitePlayerView.on('invite',
            (player) => {

                if (window.confirm(`Challenge ${player.name}?`)) {
                    this.router.go(this, 'SendChallenge', {playerId: player.id});
                }
        });

        this.invitePlayerView.on('close', () => {
            this.router.go(this, 'Main');
        });


    }

    /**
     * 1. Show a list of players
     * @returns {InvitePlayerView|*}
     * @constructor
     */
    Main() {

        if (this.gameContext.isNewPlayer()) {
            this.router.go(ProfileController, 'Register');
        }
        else {
            return this.myGamesView;
        }
    }


    InvitePlayers() {
        if (this.gameContext.isNewPlayer()) {
            this.router.go(ProfileController, 'Register');
        }
        else {
            return this.invitePlayerView;
        }
    }



    /**
     * 1. Send a challenge to online user
     * @param playerId
     * @constructor
     */
    SendChallenge(playerId) {
        this.gameContext.invitePlayer(playerId);
        this.router.go(this, 'Main');
    }



    /**
     * 2. Accept a challenge from online user
     * @param playerId
     * @constructor
     */
    AcceptChallenge(gameId) {

        // indicate game has started
        this.gameContext.acceptGame(gameId);
    }
}
