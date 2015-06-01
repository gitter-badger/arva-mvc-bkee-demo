/**
 * Created by mysim1 on 26/03/15.
 */
import Surface                      from 'famous/core/Surface';
import InputSurface                 from 'famous/surfaces/InputSurface';
import View                         from 'famous/core/View';
import {ObjectHelper}               from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import BkImageSurface               from 'famous-bkimagesurface/BkImageSurface';
import FlexScrollView               from 'famous-flex/src/FlexScrollView';
import CollectionLayout             from 'famous-flex/src/layouts/CollectionLayout';
import ViewSequence                 from 'famous/core/ViewSequence';
import Background                   from '../../components/Background';
import DataBoundScrollView          from 'arva-mvc/components/DataBoundScrollView';
import _                            from 'lodash';

const DEFAULT_OPTIONS = {
    headerHeight: 75,
    rowSize: 50,
    defaultModel: []
};

export default class ChangeAvatarView extends View {



    constructor(options = {}) {
        let newOptions = _.extend(options, DEFAULT_OPTIONS);
        super(newOptions);

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
        let viewContext = this;

        this._renderables = {
            background: new Background(),

            header: new Surface({
                classes: ['header'],
                content: `<div>Avatars</div>Kies je eigen avatar.`
            }),

            avatarlist: new DataBoundScrollView({
                autoPipeEvents: true,
                layout: CollectionLayout,
                layoutOptions: {
                    cells: [3,3],
                    margins: [20, 10, 20, 10],
                    spacing: [20, 20]
                },

                template: function(avatar) {
                    let avatarSurface = new BkImageSurface({
                        content: avatar.url,
                        sizeMode: BkImageSurface.SizeMode.ASPECTFIT,
                        properties: { data: avatar }
                    });
                    avatarSurface.on('click', function(){ viewContext._eventOutput.emit('select', this);});
                    return avatarSurface;
                },

                dataStore: this.options.dataSource
            })

        };
    }

    _createLayout() {
        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context) {

                context.set('background', {
                    size: context.size,
                    translate: [0,0,0]
                });

                context.set('header', {
                    size: [context.size[0], this.options.headerHeight],
                    translate: [0, 0, 20]
                });

                context.set('avatarlist', {
                    size: [context.size[0], context.size[1]/1.3],
                    translate: [0,this.options.headerHeight, 2]
                });


            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}