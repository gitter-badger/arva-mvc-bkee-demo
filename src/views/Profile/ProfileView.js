/**
 * Created by mysim1 on 26/03/15.
 */
import Surface                      from 'famous/core/Surface';
import InputSurface                 from 'famous/surfaces/InputSurface';
import View                         from 'famous/core/View';
import ObjectHelper                 from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface';


const DEFAULT_OPTIONS = {
    headerHeight: 75,
    rowSize: 50
};

export default class ProfileView extends View {



    constructor(OPTIONS) {
        super(DEFAULT_OPTIONS);

        /* Bind all local methods to the current object instance, so we can refer to 'this'
         * in the methods as expected, even when they're called from event handlers.        */
        ObjectHelper.bindAllMethods(this, this);

        /* Hide all private properties (starting with '_') and methods from enumeration,
         * so when you do for( in ), only actual data properties show up. */
        ObjectHelper.hideMethodsAndPrivatePropertiesFromObject(this);

        /* Hide the priority field from enumeration, so we don't save it to the dataSource. */
        ObjectHelper.hidePropertyFromObject(Object.getPrototypeOf(this), 'length');

        this._dataSource = OPTIONS.dataSource;

        this._createRenderables();
        this._createLayout();
    }



    _createRenderables() {

        if (!this._dataSource) {
            console.log('No data source');
            return;
        }

        this._renderables = {
            header: new Surface({
                content: `<div>${this._dataSource.name}</div>Je kan je avatar en naam hieronder wijzigen.`,
                classes: ['header']
            }),
            avatar: new BkImageSurface({content: this._dataSource.avatar}),
            name: new InputSurface({value: this._dataSource.name}),
            score: new Surface({
                classes: ['profile'],
                content: `<div class="lost">${this._dataSource.lost}<span>lost</span></div>
                <div class="draw">${this._dataSource.draw}<span>draw</span></div>
                <div class="won">${this._dataSource.won}<span>won</span></div>`
            })
        };
    }

    _createLayout() {
        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context) {

                let area = (context.size[1]-this.options.headerHeight)-40;
                let rows = Math.floor(area/50);
                let avatarSpan = rows*0.6;
                let nameSpan = 1;
                let scoreSpan = rows*0.3;

                context.set('header', {
                    size: [context.size[0], this.options.headerHeight],
                    translate: [0,0,1]
                });

                context.set('avatar', {
                    size: [context.size[0], avatarSpan*this.options.rowSize],
                    translate: [0,this.options.headerHeight,1]
                });

                context.set('name', {
                    size: [context.size[0], nameSpan*this.options.rowSize],
                    translate: [0,(avatarSpan*this.options.rowSize)+this.options.headerHeight,1]
                });

                context.set('score', {
                    size: [context.size[0], scoreSpan*this.options.rowSize],
                    //align: [0,0.5],
                    translate: [0,((avatarSpan+nameSpan)*this.options.rowSize)+this.options.headerHeight,1]
                });

            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}