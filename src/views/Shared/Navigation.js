/**
 * Created by mysim1 on 26/03/15.
 */
import Surface                      from 'famous/core/Surface';
import View                         from 'famous/core/View';
import ObjectHelper                 from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import TabBar                       from 'famous-flex/src/widgets/TabBar';

import Arena                        from '../../svg/arena.svg';
import Play                         from '../../svg/play.svg';
import Profile                      from '../../svg/profile.svg';

const DEFAULT_OPTIONS = {

};

export default class Navigation extends View {



    constructor() {
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

    _createRenderables() {

        var tabBar = new TabBar({
            createRenderables: {
                background: true,
                selectedItemOverlay: true
            }
        });


        tabBar.setItems([
            '<div>'+Arena+'</div>Arena',
            '<div>'+Play+'</div>Speel',
            '<div>'+Profile+'</div>Profiel'
        ]);

        this._renderables = {
            tabBar: tabBar
        };
    }

    _createLayout() {
        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context) {


                context.set('tabBar', {
                    size: [context.size[0], 40],
                    align: [0,1],
                    origin: [0,1],
                    translate: [0, 0, 20]
                });
            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}