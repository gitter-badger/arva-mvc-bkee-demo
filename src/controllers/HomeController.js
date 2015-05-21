/**
 * Created by mysim1 on 21/04/15.
 */


import {Controller}         from 'arva-mvc/core/Controller';
import InvitePlayerView     from '../views/Home/InvitePlayerView';

import Game                 from '../models/Game';
import Invite               from '../models/Invite';

import Players              from '../collections/Players';
import GameContext          from '../utils/GameContext';
import {GetDefaultContext}  from 'arva-mvc/DefaultContext';

import {ProfileController}  from './ProfileController';
import {PlayController}     from './PlayController';


export class HomeController extends Controller {

    constructor(router, context) {
        super(router, context);

        this.gameContext = GetDefaultContext().get(GameContext);

        // views and databinding
        this.invitePlayerView = new InvitePlayerView({
            dataSource: this.gameContext.players
        });

        this.invitePlayerView.on('invite',
            (player) => {
                if (window.confirm(`Challenge ${player.name}?`)) {
                    this.router.go(this, 'SendChallenge', {playerId: player.id});
                }
        });
    }

    /**
     * 1. Show a list of active players
     * @returns {InvitePlayerView|*}
     * @constructor
     */
    Main() {

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

        /*
        let dice = (Math.random()*10)+1;
        let newGame = new Game();

        newGame.on('ready', function() {
            newGame.progressState = 'invited';
            //newGame.activeSince = null;
            //newGame.winner = null;
            //newGame.startingPlayer = dice>5?playerId:GameContext.getPlayerId();
            //newGame.gameState = [];
        });*/

        let sendInvite = new Invite(playerId);

        sendInvite.on('ready', function() {
            sendInvite.from = this.gameContext.getPlayerId();
            //sendInvite.gameId = newGame.id;
        });
    }

    /**
     * 2. Accept a challenge from online user
     * @param playerId
     * @constructor
     */
    AcceptChallenge(gameId) {
        let newGame = new Game(gameId);
        newGame.progressState = 'active';
        newGame.activeSince = Date.now();

        // indicate game has started
        GameContext.startGame(gameId);

        this.router.go(PlayController, 'Main', { gameId: gameId});
    }
}
