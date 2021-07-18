var _ = {}

_.type = function(obj){
    return Object.prototype.toString.call(obj).replace(/^\[object\s|\]/g,'')
}

_.isString = function(obj){
    return _.type(obj) === "String"
}