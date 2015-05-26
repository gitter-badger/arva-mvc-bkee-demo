/**
 * Created by mysim1 on 16/02/15.
 */
import Surface                      from 'famous/core/Surface';
import View                         from 'famous/core/View';
import {ObjectHelper}               from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';


const DEFAULT_OPTIONS = {
    headerHeight: 75
};

export class NewGameView extends View {

    constructor(){
        super();

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

        this._renderables = {
            infopanel: new Surface({content: 'Hello!'})
        };
    }

    _createLayout() {
        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context) {
                context.set('infopanel', {
                    size: [context.size[0], 50]
                });
            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }


    function createGrid( section, dimensions ) {
        var grid = new GridLayout({
            dimensions: dimensions
        });

        var surfaces = [];
        grid.sequenceFrom(surfaces);

        for(var i = 0; i < dimensions[0] * dimensions[1]; i++) {




            var playerName = new InputSurface({
                size: [undefined, undefined],
                name: 'Player ' + (i+1),
                placeholder: 'Wat is je naam?',
                value: '',
                type: 'text'
            });




            surfaces.push(playerName);
        }

        return grid;
    }
}