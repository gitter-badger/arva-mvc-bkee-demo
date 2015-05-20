/**
 * Created by mysim1 on 17/05/15.
 */

import PrioritisedArray     from 'arva-ds/core/Model/prioritisedArray';
import OnlinePlayer         from '../models/OnlinePlayer';


export default class OnlinePlayers extends PrioritisedArray
{
    constructor(datasource = null, datasnapshot = null) {
        super(OnlinePlayer, datasource, datasnapshot);
    }
}