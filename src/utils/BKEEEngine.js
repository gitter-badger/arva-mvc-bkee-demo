/**
 * Created by mysim1 on 16/02/15.
 */

import Game          from '../models/Game';
import EventEmitter  from 'eventemitter3';


const winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

export default class BKEEEngine extends EventEmitter {

    constructor(activePlayer, game) {
        super();
        this._activePlayer = activePlayer;
        this._game = game;
        if (!this._game.data) {
            this._state = {};
            this._state[this._game.player1.id] = [];
            this._state[this._game.player2.id] = [];
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
            this._game.status = 'won';
            this._game.nextPlayer = '';
            this.emit('won');
        }
        else if ((this._state[this._game.player1.id].length+this._state[this._game.player2.id].length)==9) {
            this._game.status = 'finished';
            this._game.nextPlayer = '';
            this.emit('draw');
        }
        else {
            this._game.nextPlayer = this._game.nextPlayer==this._game.player1.id?
                this._game.player2.id:
                this._game.player1.id;
        }
    }

    evaluate() {
        if (this._game.status == 'won' && this._game.winner!= this._activePlayer) {
            this._game.status = 'finished';
            this.emit('loss');
        }
    }

    _evaluateGameResult(moves) {
        let won = false;

        winningCombinations.forEach(function(combination) {
            if (!won) {
                let foundMoves = 0;

                moves.forEach(function (move) {
                    if (combination.indexOf(move.position)) {
                        foundMoves++;
                    }
                });

                if (foundMoves==3) won = true;
            }
        });

        return won;
    }
}

