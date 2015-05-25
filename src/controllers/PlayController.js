/**
 * Created by mysim1 on 21/04/15.
 */


import {Controller}         from 'arva-mvc/core/Controller';
import {GetDefaultContext}  from 'arva-mvc/DefaultContext';
import Game                 from '../models/Game';
import {PlayView}           from '../views/Play/PlayView';
import InvitePlayerView     from '../views/Home/InvitePlayerView';
import {FireOnceAndWait}    from '../utils/helpers';
import BKEEEngine           from '../utils/BKEEEngine';
import GameContext          from '../utils/GameContext';

export class PlayController extends Controller {

    constructor(router, context) {
        super(router, context);

        this.gameContext = GetDefaultContext().get(GameContext);

    }


    Play(gameId) {

        let gameView = new PlayView();
        let activePlayer = this.gameContext.getPlayerId();

        if (!gameId) {
            gameView.set();
        } else {
            let gameState = new Game(gameId);
            let gameEngine = null;

            // when this player made a move. have the GameEngine evaluate
            gameView.on('move', function(move) {
                if (gameEngine && gameState.nextPlayer==activePlayer) {
                    gameEngine.move(move.by, move.position);
                }
            });

            // when data is updated by the game engine. reflect the view
            gameState.on('value', function() {
                gameEngine = new BKEEEngine(gameState);
                gameView.set(activePlayer, gameState);
            });

            this.gameContext.setLastActiveGame(gameId);
        }

        return gameView;
    }


    Main() {
        this.router.go(this, 'Play', { gameId: this.gameContext.getLastActiveGame()});
    }
}
