/**
 * Created by mysim1 on 17/05/15.
 */

import PrioritisedArray     from 'arva-ds/core/Model/prioritisedArray';
import Player               from '../models/Player';


export default class Players extends PrioritisedArray
{
    constructor(datasource = null, datasnapshot = null) {
        super(Player, datasource, datasnapshot);
    }
}