/**
 * Created by mysim1 on 16/02/15.
 */


import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface';



export default class Background extends BkImageSurface {

    constructor(){

        super({
            content: 'img/back.png',
            sizeMode: BkImageSurface.SizeMode.ASPECTFILL
        });
    }
}