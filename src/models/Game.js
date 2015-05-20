
import Model                from 'arva-ds/core/Model';

export default class Game extends Model {

    /**
     * invited, active, finished
     */
    get progressState() { }

    /**
     * indicates when the game started.
     */
    get activeSince() {}

    /**
     * undetermined OR <playerId>
     */
    get winner() {}

    /**
     * Defines who will start the game
     */
    get startingPlayer() {}
    /**
     * Stores a list of moves like
     * [{ by: 'player-34394', position: 0 },
     *  { by: 'player-14299', position: 1 },
     *  { by: 'player-34394', position: 3 },
     *  { by: 'player-14299', position: 6 }
     * ]
     */
    get gameState() {}
}