/**
 * Created by mysim1 on 21/04/15.
 */
/**
 * Created by mysim1 on 25/03/15.
 */


import {annotate, Provide, ProvidePromise}       from 'di.js';
import {DataSource}              from 'arva-ds/core/DataSource';
import {FirebaseDataSource}      from 'arva-ds/datasources/FirebaseDataSource';



@Provide(DataSource)
export function BkeeDataSource() {

    let ds = new FirebaseDataSource("https://bkee.firebaseio.com");

    if (localStorage["bkee.playertoken"]) {

        let token = localStorage["bkee.playertoken"];
        ds.authWithCustomToken(token, function(error, authData) {
            if (error) {
                console.log(`Access not allowed.`);
            } else {
                console.log(`Authenticated.`);
            }
        });
    }

    return ds;
}
