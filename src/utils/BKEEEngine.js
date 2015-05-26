/**
 * Created by mysim1 on 16/02/15.
 */

import Game          from '../models/Game';
import EventEmitter  from 'eventemitter3';
import _             from 'lodash';

const winningCombinations = [[1,2,3],[4,5,6],[7,8,9],[1,4,7],[2,5,8],[3,6,9],[1,5,9],[3,5,7]];

export default class BKEEEngine extends EventEmitter {

    constructor(activePlayer, game) {
        super();
        this._activePlayer = activePlayer;
        this._game = game;
        if (!this._game.data) {
            this._state = [];
        }
        else {
            this._state = this._game.data;
        }
    }

    move(by, position) {

        if (this._game.winner) return;

        let allowedMove = true;
        // add position
        this._state.forEach(function(move) {
            if (move.position==position) allowedMove = false;
        });

        if (!allowedMove) return;

        this._state.push({ by: by, position: position});
        this._game.data = this._state;

        let didIWin = this._evaluateGameResult(_.filter(this._state, { by: by }));

        if (didIWin) {
            this._game.winner = by;
            this._game.status = 'won';
            this._game.nextPlayer = null;
            this.emit('won');
        }
        else if (this._state.length==9) {
            this._game.status = 'draw';
            this._game.nextPlayer = null;
            this.emit('draw');
        }
        else {
            if (this._game.nextPlayer) {
                this._game.nextPlayer = this._game.nextPlayer == this._game.player1.id ?
                    this._game.player2.id :
                    this._game.player1.id;
            }
        }
    }

    _evaluateGameResult(moves) {
        let won = false;

        winningCombinations.forEach(function(combination) {
            if (!won) {
                let foundMoves = 0;

                moves.forEach(function (move) {
                    if (combination.indexOf(move.position)>-1) {
                        foundMoves++;
                    }
                });

                if (foundMoves==3) {
                    won = true;
                }
            }
        });

        return won;
    }
}

