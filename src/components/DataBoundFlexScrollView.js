/**
 * Created by mysim1 on 16/02/15.
 */


import Surface          from 'famous/core/Surface';
import FlexScrollView   from 'famous-flex/src/FlexScrollView';



export default class DataBoundFlexScrollView extends FlexScrollView {

    constructor(OPTIONS = {}){

        // if no default for autoPipeEvents, have it set to true
        if (!OPTIONS.autoPipeEvents) OPTIONS.autoPipeEvents = true;
        super(OPTIONS);

        if (this.options.dataStore)
            this._bindDataSource(this.options.dataStore);
        else {
            console.log('No DataSource was set.');
        }
    }



    _reTouchList() {
        if (this._dataSource) {
            let i = 0;
            for (i; i < this._dataSource.length; i++) {
                let bg = i % 2 ? '#e8e8e8' : '#efefef';
                this._dataSource[i].properties.backgroundColor = bg;
            }
        }
    }

    _bindDataSource() {

        if (!this.options.dataStore || !this.options.template) {
            console.log('Datasource and template should both be set.');
            return;
        }

        if (!this.options.template instanceof Function) {
            console.log('Template needs to be a function.');
            return;
        }

        this.options.dataStore.on('child_added', function(child) {

            if (this.options.dataFilter &&
                typeof this.options.dataFilter === "function" &&
                !this.options.dataFilter(child)) {
                    return;
            }

            this.insert(child.priority, this.options.template(child));
            this._reTouchList();

        }, this);


        this.options.dataStore.on('child_changed', function(child) {

            if (this.options.dataFilter &&
                typeof this.options.dataFilter === "function" &&
                !this.options.dataFilter(child)) {
                this.remove(child.priority);
            }
            else {
                this.replace(child.priority, this.options.template(child));
            }

            this._reTouchList();

        }, this);

        this.options.dataStore.on('child_moved', function(child, oldposition) {

            this.swap(oldposition, child.priority);
            this._reTouchList();

        }, this);


        this.options.dataStore.on('child_removed', function(child) {

            this.remove(child.priority);

            //for (let i=0;i<this._dataSource.length;i++) {
            //    if (this._dataSource[i].properties&&this._dataSource[i].properties.id===child.id)
            //        this.remove(i);
            //}

            this._reTouchList();

        }, this);

    }

}