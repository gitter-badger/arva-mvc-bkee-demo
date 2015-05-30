/**
 * Created by mysim1 on 21/04/15.
 */


import {Controller}         from 'arva-mvc/core/Controller';
import {GetDefaultContext}  from 'arva-mvc/DefaultContext';

import Player               from '../models/Player';
import {HomeController}     from './HomeController';
import GameContext          from '../utils/GameContext';
import {FireOnceAndWait,
        RegisterNewAccount} from '../utils/helpers';

import ProfileView          from '../views/Profile/ProfileView';
import ChangeAvatarView     from '../views/Profile/ChangeAvatarView';


export class ProfileController extends Controller {

    constructor(router, context) {
        super(router, context);

        this.gameContext = GetDefaultContext().get(GameContext);
    }


    /**
     * Register as new Player
     * @constructor
     */
    Register() {

        if (this.gameContext.isNewPlayer()) {
            let newPlayerName = this.gameContext.getDefaultPlayerName();

            RegisterNewAccount(this.gameContext.ds)
                .then((authData) => {
                    let newPlayer = new Player(null, {
                        uid: authData.uid,
                        name: newPlayerName,
                        lost: 0,
                        won: 0,
                        draw: 0,
                        score: 0,
                        lastTimeAccessed: Date.now(),
                        avatar: 'https://bitcoinwallet.com/images/users/unknown_user.png'
                    });
                    this.gameContext.players.add(newPlayer);
                    this.gameContext.setActivePlayer(newPlayer.id, authData.token);
                    this.router.go(this, 'Show', {playerId: newPlayer.id});
            });

        } else {
            this.router.go(HomeController, 'Main');
        }
    }

    /**
     * Show Player
     * @param playerId
     * @constructor
     */
    Show(playerId) {
        let controllerContext = this;

        if (!playerId) this.router.go(HomeController, 'Main');
        else {
            let playerToShow = new Player(playerId);
            //await FireOnceAndWait(playerToShow);

            let profileView = new ProfileView();
            profileView.set(playerToShow);

            playerToShow.on('value', () => {
                profileView.set(playerToShow);
            });

            profileView._renderables.name.on('change', function() {
                playerToShow.name = this.getValue();
                this.setValue('');
            });

            profileView._renderables.avatar.on('click', function() {
                controllerContext.router.go(controllerContext, 'ChangeAvatar');
            });

            return profileView;
        }
    }

    ChangeAvatar() {
        let controllerContext = this;

        let avatarView = new ChangeAvatarView();

        this.gameContext.avatars.once('value', function() {
            avatarView.set(this.gameContext.avatars);

        });

        avatarView.on('select', function(avatar) {
            let playerId = controllerContext.gameContext.getPlayerId();
            let playerToUpdate = new Player(playerId);
            playerToUpdate.once('ready', function(){playerToUpdate.avatar=avatar.properties.data.url});
            controllerContext.router.go(controllerContext, 'Show', {playerId: playerId});
        });
        return avatarView;
    }
}
