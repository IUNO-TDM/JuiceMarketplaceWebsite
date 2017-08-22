/**
 * Created by beuttlerma on 28.03.17.
 */

function Component(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
}

/**
 *
 * @param jsonData
 * @returns {*}
 * @constructor
 */
Component.prototype.CreateComponentFromJSON = Component.CreateComponentFromJSON = function (jsonData) {

    if (!jsonData) {
        return new Component();
    }

    return new Component(
        jsonData['componentuuid'],
        jsonData['componentname'],
        jsonData['componentdescription']
    );
};

module.exports = Component;