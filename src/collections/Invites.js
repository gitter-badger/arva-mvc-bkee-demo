/**
 * Created by mysim1 on 17/05/15.
 */

import {PrioritisedArray}   from 'arva-ds/core/Model/prioritisedArray';
import Invite               from '../models/Invite';


export default class Invites extends PrioritisedArray
{
    constructor(datasource = null, datasnapshot = null) {
        super(Invite, datasource, datasnapshot);
    }
}