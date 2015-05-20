/**
 * Created by mysim1 on 17/05/15.
 */

import PrioritisedArray     from 'arva-ds/core/Model/prioritisedArray';
import Game                 from '../models/Game';


export default class Games extends PrioritisedArray
{
    constructor(datasource = null, datasnapshot = null) {
        super(Game, datasource, datasnapshot);
    }
}