/**
 * Created by mysim1 on 16/02/15.
 */

import Surface                      from 'famous/core/Surface';
import View                         from 'famous/core/View';
import ObjectHelper                 from 'arva-mvc/utils/objectHelper';
import LayoutController             from 'famous-flex/src/LayoutController';
import Background                   from '../../components/Background';

const DEFAULT_OPTIONS = {
    headerHeight: 75,
    navigationHeight: 40
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
        this._handleMoves();
    }

    set(activePlayer, gameState) {

        this.nextPlayer = gameState.nextPlayer;
        this.nextPlayerName = gameState.player1.id==gameState.nextPlayer?
            gameState.player1.name:
            gameState.player2.name;

        this._renderables.header.setContent(`<div class="player1">${gameState.player1.name}<span>X</span></div>
        <div class="player2">${gameState.player2.name}<span>O</span></div>`);


        this._renderables.footer.setContent(`Turn: ${this.nextPlayerName}`);

        if (gameState.data && gameState.data[gameState.player1.id]) {
            gameState.data[gameState.player1.id].forEach((move) => {
                this._renderables[`surface${move.position}`].setContent('X');
            });
        }

        if (gameState.data && gameState.data[gameState.player2.id]) {
            gameState.data[gameState.player2.id].forEach((move) => {
                this._renderables[`surface${move.position}`].setContent('O');
            });
        }
    }

    _createRenderables() {

        this._renderables = {
            background: new Background(),
            header: new Surface({classes: ['header', 'players'] }),
            surface1: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#efefef'} }),
            surface2: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#e8e8e8'} }),
            surface3: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#efefef'} }),
            surface4: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#e8e8e8'} }),
            surface5: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#efefef'} }),
            surface6: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#e8e8e8'} }),
            surface7: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#efefef'} }),
            surface8: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#e8e8e8'} }),
            surface9: new Surface({content: '', properties: { textAlign:'center', backgroundColor: '#efefef'} }),
            footer: new Surface({classes: ['footer', 'players'] })
        };
    }

    _handleMoves() {
        let viewContext = this;

        this._renderables.surface1.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 1 });
        });

        this._renderables.surface2.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 2 });
        });

        this._renderables.surface3.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 3 });
        });

        this._renderables.surface4.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 4 });
        });

        this._renderables.surface5.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 5 });
        });

        this._renderables.surface6.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 6 });
        });

        this._renderables.surface7.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 7 });
        });

        this._renderables.surface8.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 8 });
        });

        this._renderables.surface9.on('click', function() {
            viewContext._eventOutput.emit('move', { by: viewContext.nextPlayer, position: 9 });
        });
    }

    _setSurfaceProperties(surface, properties) {
        surface.properties.lineHeight = `${properties.diameter}px`;
        surface.properties.fontSize = `${properties.diameter/1.5}px`;
    }

    _createLayout() {
        //let top = this.options.headerHeight;
        let viewContext = this;

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

                viewContext._setSurfaceProperties(context.get('surface1').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface2').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface3').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface4').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface5').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface6').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface7').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface8').renderNode, { diameter: diameter});
                viewContext._setSurfaceProperties(context.get('surface9').renderNode, { diameter: diameter});


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
                    size: [context.size[0], top-this.options.navigationHeight],
                    align: [0,1],
                    origin: [0,1],
                    translate: [0, -this.options.navigationHeight, 1000]
                });

            }.bind(this),
            dataSource: this._renderables
        });
        this.add(this.layout);
        this.layout.pipe(this._eventOutput);
    }
}


