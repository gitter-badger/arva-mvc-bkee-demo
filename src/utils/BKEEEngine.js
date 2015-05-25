/**
 * Created by mysim1 on 16/02/15.
 */

import Game     from '../models/Game';
import _        from 'lodash';


const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

export default class BKEEEngine {

    constructor(game) {
        this._game = game;
        if (!this._game.data) {
            this._state = {};
            this._state[this._game.player1] = [];
            this._state[this._game.player2] = [];
        }
        else {
            this._state = this._game.data;
        }
    }

    move(by, position) {

        // add position
        if (!this._state[by]) this._state[by]= [];
        this._state[by].push({ by: by, position: position});
        this._game.data = this._state;
        let didIWin = this._evaluateGameResult(this._state[by]);

        if (didIWin) {
            this._game.winner = by;
            this._game.status = 'finished';
            this._game.nextPlayer = '';
        }
        else if ((this._state[this._game.player1].length+this._state[this._game.player2].length)==9) {
            this._game.status = 'finished';
            this._game.nextPlayer = '';
        }
        else {
            this._game.nextPlayer = this._game.nextPlayer==this._game.player1?
                this._game.player2:
                this._game.player1;
        }




    }

    _evaluateGameResult(moves) {
        let won = false;

        winningCombinations.forEach(function(combination) {
            if (_.isEqual(moves, combination)) won = true;
        });

        return won;
    }
}

