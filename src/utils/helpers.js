/**
 * Created by mysim1 on 21/05/15.
 */

export function FireOnceAndWait(object) {
    if (object.once) {
        return new Promise(function (resolve) {
            object.once('ready', function () {
                resolve();
            });
        });
    } else return Promise.resolve();
}