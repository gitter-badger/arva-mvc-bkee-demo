/**
 * Created by mysim1 on 26/03/15.
 */
import Surface                      from 'famous/core/Surface';
import InputSurface                 from 'famous/surfaces/InputSurface';
import View                         from 'famous/core/View';
import {ObjectHelper}               from 'arva-utils/ObjectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface';
import Background                   from '../../components/Background';

const DEFAULT_OPTIONS = {
    headerHeight: 75,
    rowSize: 50,
    defaultModel: {
        name: 'name',
        avatar: 'http://www.nowseethis.org/avatars/default/missing.gif',
        lost: 0,
        draw: 0,
        won: 0,
        score: 0
    }
};

export default class ProfileView extends View {



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
        this.set(this.options.defaultModel);
    }

    set(model) {
        this._renderables.header.setContent(`<div>${model.name}</div>Je kan je avatar en naam hieronder wijzigen.`);

        this._renderables.avatar.setContent(model.avatar);

        this._renderables.score.setContent(`<div class="lost">${model.lost}<span>lost</span></div>
                <div class="draw">${model.draw}<span>draw</span></div>
                <div class="won">${model.won}<span>won</span></div>`);
    }




    _createRenderables() {

        this._renderables = {
            background: new Background(),

            header: new Surface({
                classes: ['header']
            }),
            avatar: new BkImageSurface({
                sizeMode: BkImageSurface.SizeMode.ASPECTFILL
            }),
            name: new InputSurface({properties:{textAlign:'center'}, placeholder:'Verander hier je naam...', value: ''}),
            score: new Surface({
                classes: ['profile']
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


                context.set('background', {
                    size: context.size,
                    translate: [0,0,0]
                });

                context.set('header', {
                    size: [context.size[0], this.options.headerHeight],
                    translate: [0,0,2]
                });

                context.set('avatar', {
                    size: [context.size[0], avatarSpan*this.options.rowSize],
                    translate: [0,this.options.headerHeight,2]
                });

                context.set('name', {
                    size: [context.size[0], nameSpan*this.options.rowSize],
                    translate: [0,(avatarSpan*this.options.rowSize)+this.options.headerHeight,2]
                });

                context.set('score', {
                    size: [context.size[0], scoreSpan*this.options.rowSize],
                    translate: [0,((avatarSpan+nameSpan)*this.options.rowSize)+this.options.headerHeight,2]
                });

            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}