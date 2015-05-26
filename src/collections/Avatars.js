/**
 * Created by mysim1 on 17/05/15.
 */

import {PrioritisedArray}   from 'arva-ds/core/Model/prioritisedArray';
import Avatar               from '../models/Avatar';


export default class Avatars extends PrioritisedArray
{
    constructor(datasource = null, datasnapshot = null) {
        super(Avatar, datasource, datasnapshot);
    }
}