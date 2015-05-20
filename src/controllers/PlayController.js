/**
 * Created by mysim1 on 21/04/15.
 */


import {Controller}         from 'arva-mvc/core/Controller';
import {PlayView}           from '../views/Play/PlayView';
import InvitePlayerView     from '../views/Home/InvitePlayerView';


export class PlayController extends Controller {

    constructor(router, context) {
        super(router, context);

        this.playView = new PlayView();
    }

    /**
     * Setup a game against person
     * @param playerId
     * @constructor
     */
    SetupGame(playerId) {
        //
    }

    SetupAvatar() {

    }

    StartGame() {


    }

    EndGame() {

    }

    /*
     SetupAvatar

     StartGame

     EndGame

    * */

    Main() {
        return this.playView;
    }
}
