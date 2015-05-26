/**
 * Created by mysim1 on 26/03/15.
 */
import Surface                      from 'famous/core/Surface';
import View                         from 'famous/core/View';
import {ObjectHelper}               from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import DataboundFlexScrollView      from '../../components/DataBoundFlexScrollView';
import Background                   from '../../components/Background';

const DEFAULT_OPTIONS = {
    headerHeight: 75
};

export default class InvitePlayerView extends View {



    constructor(options = {}) {
        super(DEFAULT_OPTIONS);

        /* Bind all local methods to the current object instance, so we can refer to 'this'
         * in the methods as expected, even when they're called from event handlers.        */
        ObjectHelper.bindAllMethods(this, this);

        /* Hide all private properties (starting with '_') and methods from enumeration,
         * so when you do for( in ), only actual data properties show up. */
        ObjectHelper.hideMethodsAndPrivatePropertiesFromObject(this);

        /* Hide the priority field from enumeration, so we don't save it to the dataSource. */
        ObjectHelper.hidePropertyFromObject(Object.getPrototypeOf(this), 'length');

        if (options.dataSource) this._dataSource = options.dataSource;

        this._createRenderables();
        this._createLayout();

    }


    _createRenderables() {
        let contextView = this;

        var invitePlayers = new DataboundFlexScrollView({

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
            template: function(player) {

                let isOnline = (Date.now() - player.lastTimeAccessed)<10000?'online':'offline';

                let surface = new Surface({
                    size: [undefined, 50],
                    classes: ['arena-item'],
                    properties: {
                        lineHeight: '50px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        data: player
                    },
                    content: `<div class="indicator ${isOnline}"></div>
                    <div class="avatar" style="background-image: url(${player.avatar});"></div>
                    <div class="playername">${player.name}</div>
                    <div class="score">${player.score}</div>`
                });

                surface.on('click', function() {
                    contextView._eventOutput.emit('invite', this.properties.data);
                });

                return surface;
            },

            dataStore: this._dataSource

        });



        this._renderables = {
            background: new Background(),
            header: new Surface({
                content: '<div>B K E E &nbsp;&nbsp;&nbsp;&nbsp; W A R S</div>Daag iemand uit voor een potje Boter Kaas en Eieren',
                classes: ['header']
            }),
            players: invitePlayers
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

                context.set('players', {
                    size: [context.size[0], context.size[1]/1.3],
                    translate: [0, top, 2]
                });

            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}