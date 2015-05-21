
import Model                from 'arva-ds/core/Model';

export default class Game extends Model {

    /**
     * inviting player
     */
    get player1() {}

    /**
     * Invited player
     */
    get player2() {}

    /**
     * indicates when the game started.
     */
    get activeSince() {}

    /**
     * undetermined OR <playerId>
     */
    get winner() {}

    /**
     * Next player that should make a move
     */
    get nextPlayer() {}

    /**
     * moves in string
     */
    get state() {}

    /**
     * active, finished
     */
    get status() {}
}