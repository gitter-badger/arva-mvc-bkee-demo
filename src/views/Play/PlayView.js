/**
 * Created by mysim1 on 16/02/15.
 */

import Surface                      from 'famous/core/Surface';
import View                         from 'famous/core/View';
import ObjectHelper                 from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import Background                   from '../../components/Background';

const DEFAULT_OPTIONS = {
    headerHeight: 75
};

export class PlayView extends View {

    constructor(){
        super(DEFAULT_OPTIONS);

        /* Bind all local methods to the current object instance, so we can refer to 'this'
         * in the methods as expected, even when they're called from event handlers.        */
        ObjectHelper.bindAllMethods(this, this);

        /* Hide all private properties (starting with '_') and methods from enumeration,
         * so when you do for( in ), only actual data properties show up. */
        ObjectHelper.hideMethodsAndPrivatePropertiesFromObject(this);

        /* Hide the priority field from enumeration, so we don't save it to the dataSource. */
        ObjectHelper.hidePropertyFromObject(Object.getPrototypeOf(this), 'length');

        this._createRenderables();
        this._createLayout();
    }

    set() {

    }

    _createRenderables() {

        this._renderables = {
            background: new Background(),
            header: new Surface({content: 'BKEE!', classes: ['header'] }),
            surface1: new Surface({content: '', properties: { backgroundColor: '#efefef'} }),
            surface2: new Surface({content: '', properties: { backgroundColor: '#e8e8e8'} }),
            surface3: new Surface({content: '', properties: { backgroundColor: '#efefef'} }),
            surface4: new Surface({content: '', properties: { backgroundColor: '#e8e8e8'} }),
            surface5: new Surface({content: '', properties: { backgroundColor: '#efefef'} }),
            surface6: new Surface({content: '', properties: { backgroundColor: '#e8e8e8'} }),
            surface7: new Surface({content: '', properties: { backgroundColor: '#efefef'} }),
            surface8: new Surface({content: '', properties: { backgroundColor: '#e8e8e8'} }),
            surface9: new Surface({content: '', properties: { backgroundColor: '#efefef'} }),
            footer: new Surface({content: 'footer', properties: { backgroundColor: '#3399cc'} })
        };
    }

    _createLayout() {
        //let top = this.options.headerHeight;

        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context) {

                let diameter = context.size[0] /3;
                let centerAlignment = context.size[1]/2;
                let top = centerAlignment - ((diameter*3)/2);

                let sizing = [diameter, diameter];
                let middle = top+(diameter);
                var bottom = top+(diameter*2);

                let grid = {
                    TopLeft: [0, top, 2],
                    TopCenter: [diameter, top, 2],
                    TopRight: [diameter*2, top, 2],
                    MiddleLeft: [0, middle, 2],
                    MiddleCenter: [diameter, middle, 2],
                    MiddleRight: [diameter*2, middle, 2],
                    BottomLeft: [0, bottom, 2],
                    BottomCenter: [diameter, bottom, 2],
                    BottomRight: [diameter*2, bottom, 2]
                };

                context.set('background', {
                    size: context.size,
                    translate: [0,0,0]
                });

                context.set('header', {
                    size: [context.size[0], top],
                    translate: [0,0,2]
                });

                context.set('surface1', {
                    size: sizing,
                    translate: grid.TopLeft
                });

                context.set('surface2', {
                    size: sizing,
                    translate: grid.TopCenter
                });

                context.set('surface3', {
                    size: sizing,
                    translate: grid.TopRight
                });

                context.set('surface4', {
                    size: sizing,
                    translate: grid.MiddleLeft
                });

                context.set('surface5', {
                    size: sizing,
                    translate: grid.MiddleCenter
                });

                context.set('surface6', {
                    size: sizing,
                    translate: grid.MiddleRight
                });

                context.set('surface7', {
                    size: sizing,
                    translate: grid.BottomLeft
                });

                context.set('surface8', {
                    size: sizing,
                    translate: grid.BottomCenter
                });

                context.set('surface9', {
                    size: sizing,
                    translate: grid.BottomRight
                });

                context.set('footer', {
                    size: [context.size[0], top-50],
                    align: [0,1],
                    origin: [0,1],
                    translate: [0, -50, 1000]
                });

            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}


