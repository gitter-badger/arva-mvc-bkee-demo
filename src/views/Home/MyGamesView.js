/**
 * Created by mysim1 on 26/03/15.
 */
import Surface                      from 'famous/core/Surface';
import View                         from 'famous/core/View';
import {ObjectHelper}               from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import DataboundFlexScrollView      from '../../components/DataBoundFlexScrollView';
import Background                   from '../../components/Background';
import _                            from 'lodash';
import AutoFontsizeSurface          from 'famous-autofontsizesurface/AutoFontSizeSurface';

const DEFAULT_OPTIONS = {
    headerHeight: 75
};

export default class MyGamesView extends View {



    constructor(options = {}) {
        let newOptions = _.merge(options, DEFAULT_OPTIONS);
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
        this._createListeners();

    }


    _createRenderables() {
        let contextView = this;

        var myGames = new DataboundFlexScrollView({

            flowOptions: {
                spring: {               // spring-options used when transitioning between states
                    dampingRatio: 0.8,  // spring damping ratio
                    period: 1000        // duration of the animation
                },
                insertSpec: {           // render-spec used when inserting renderables
                    opacity: 0          // start opacity is 0, causing a fade-in effect,
                    //size: [0, 0],     // uncommented to create a grow-effect
                    //transform: Transform.translate(-300, 0, 0) // uncomment for slide-in effect
                }
                //removeSpec: {...},    // render-spec used when removing renderables
            },

            layoutOptions: {
                margins: [5, 5, 5, 5],
                spacing: 5
            },

            template: (game) => {
                let playerToShow = game.player1.id==this.options.activePlayer?
                    game.player2:
                    game.player1;

                let surface = new Surface({
                    size: [undefined, 50],
                    classes: ['arena-item'],
                    properties: {
                        lineHeight: '50px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        data: game
                    },
                    content: `<div class="avatar" style="background-image: url(${playerToShow.avatar});"></div>
                    <div class="playername">${playerToShow.name}</div>`
                });

                surface.on('click', function() {
                    contextView._eventOutput.emit('play', this.properties.data);
                });

                return surface;
            },

            dataStore: this.options.dataSource

        });



        this._renderables = {
            background: new Background(),
            header: new Surface({
                content: '<div>B K E E &nbsp;&nbsp;&nbsp;&nbsp; W A R S</div>Actieve spelletjes',
                classes: ['header']
            }),
            invite: new AutoFontsizeSurface({
                classes:['icon', 'icon-plus-sign'],
                fontSizeRange: [16, 52],
                properties: {
                    color: '#3399cc'
                }
            }),
            games: myGames
        };
    }

    _createLayout() {
        let top = this.options.headerHeight;

        this.layout = new LayoutController({
            autoPipeEvents: true,
            layout: function(context) {

                context.set('background', {
                    size: context.size,
                    translate: [0,0,0]
                });

                context.set('header', {
                    size: [context.size[0], top],
                    translate: [0,0,20]
                });

                context.set('invite', {
                    size: [56, 56],
                    translate: [0,0,3],
                    align: [0.90,0.85],
                    origin: [0.5,0.5]
                });

                context.set('games', {
                    size: [context.size[0], context.size[1]/1.3],
                    translate: [0, top, 2]
                });

            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }

    _createListeners() {
        this._renderables.invite.on('click', function() {
            this._eventOutput.emit('invite');
        });
    }
}