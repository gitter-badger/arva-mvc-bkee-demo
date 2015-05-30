/**
 * Created by mysim1 on 16/02/15.
 */


import Surface          from 'famous/core/Surface';
import FlexScrollView   from 'famous-flex/src/FlexScrollView';
import _                from 'lodash';


export default class DataBoundFlexScrollView extends FlexScrollView {

    constructor(OPTIONS = {}){

        // if no default for autoPipeEvents, have it set to true
        if (!OPTIONS.autoPipeEvents) OPTIONS.autoPipeEvents = true;
        super(OPTIONS);

        // if no direction given set default to ascending order
        if (!this.options.direction) this.options.direction = 'ascending';

        if (this.options.dataStore) {
            this._dataItems = [];
            this._bindDataSource(this.options.dataStore);
        }
        else {
            console.log('No DataSource was set.');
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

        this.options.dataStore.on('child_added', function(child, previousSibling) {

            let isDescending = this.options.direction=='descending';
            let previous = this._getPreviousIndex(previousSibling);
            let index = this._dataSource!=null?
                previous>-1? previous+(isDescending?0:1): (isDescending?0:this._dataSource.length):
                0;

            if (!this.options.dataFilter ||
                (typeof this.options.dataFilter === "function" &&
                this.options.dataFilter(child))) {

                this._addItem(index, child, true);
            }
            else {
                this._addItem(index, child, false);
            }

        }.bind(this));



        this.options.dataStore.on('child_changed', function(child, previousSibling) {
            let isDescending = this.options.direction =='descending';

            let changedIndex = this._getChildIndex(child);
            let previous = this._getPreviousIndex(previousSibling);

            if (this._dataSource && this._dataSource.length >= changedIndex) {

                if (this.options.dataFilter &&
                    typeof this.options.dataFilter === "function" && !this.options.dataFilter(child)) {
                    this._removeItem(changedIndex);
                }
                else {
                    let newIndex = previous>-1?previous+(isDescending?0:1):(isDescending?0:this._dataSource.length-1);
                    if (!this._dataItems[changedIndex].visible) this._addItem(newIndex, child, true);
                    else if (changedIndex!=newIndex) {
                        this._replaceItem(changedIndex, child);
                        this._swapItem(changedIndex, newIndex);
                    }
                    else this._replaceItem(changedIndex, child);
                }
            }
        }.bind(this));


        this.options.dataStore.on('child_moved', function(child, previousSibling) {
            let current = _getChildIndex(previousSibling);
            let previous = _getPreviousIndex(previousSibling);
            this._swapItem(current, previous);
        }.bind(this));


        this.options.dataStore.on('child_removed', function(child) {
            let index = this._getChildIndex(child);
            if (index>-1) this._removeItem(index);
        }.bind(this));
    }



    _addItem(index, child, isVisible) {
        let replace = this._dataItems[index] && this._dataItems[index].id==child.id?1:0;
        this._dataItems.splice(index, replace, {id:child.id, visible: isVisible, position: index });
        if (isVisible) {
            this.insert(index, this.options.template(child));
        }
    }

    _replaceItem(index, child) {
        this.replace(index, this.options.template(child));
    }

    _removeItem(index) {
        if (this._dataItems[index].visible) {
            this.remove(index);
            this._dataItems[index].visible = false;
        }
    }

    _swapItem(oldIndex, newIndex) {
        let isDescending = this.options.direction == 'descending';
        let isVisible = false;
        let realNewIndex = newIndex;
        let endOfListAndNotVisible = false;

        while(!isVisible || endOfListAndNotVisible) {
            isVisible = this._dataItems[realNewIndex].visible;
            if (!isVisible) realNewIndex+=isDescending?-1:1;
            endOfListAndNotVisible = realNewIndex<0||realNewIndex>(this._dataItems.length-1);
        }

        if (!endOfListAndNotVisible) {
            this.swap(oldIndex, realNewIndex);
            let oldId = this._dataItems[oldIndex];
            let otherId = this._dataItems[realNewIndex];
            this._dataItems[oldIndex] = otherId;
            this._dataItems[realNewIndex] = oldId;
        }
    }

    _getChildIndex(child) {
        if (!child)return -1;
        if (typeof child === 'object' && child.id) {
            return _.findIndex(this._dataItems, function (record) {
                return record.id == child.id;
            });
        } else {
            return _.findIndex(this._dataItems, function(record){
                return record.id == child;
            });
        }
    }


    _getPreviousIndex(child) {
        let isDescending = this.options.direction == 'descending';

        if (!child)return -1;
        if (typeof child === 'object' && child.id) {
            let index = _.findIndex(this._dataItems, function (record) {
                return record.id == child.id;
            });

            if (!this._dataItems[index].visible) {
                return this._getChildIndex(this._dataItems[isDescending?index-1:index+1]);
            }
            else return index;
        }
        else {
            let foundIndex = _.findIndex(this._dataItems, function(record){
                return record.id == child;
            });

            if (!this._dataItems[foundIndex].visible) {
                return this._getChildIndex(this._dataItems[isDescending?foundIndex-1:foundIndex+1]);
            }
            else return foundIndex;
        }
    }
}