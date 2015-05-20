/**
 * Created by mysim1 on 21/04/15.
 */
/**
 * Created by mysim1 on 25/03/15.
 */


import {annotate, Provide}  from 'di.js';
import {DataSource}         from 'arva-ds/core/DataSource';
import {FirebaseDataSource} from 'arva-ds/datasources/FirebaseDataSource';


export function BkeeDataSource() {
    return new FirebaseDataSource("https://bkee.firebaseio.com");
}

annotate(BkeeDataSource, new Provide(DataSource));