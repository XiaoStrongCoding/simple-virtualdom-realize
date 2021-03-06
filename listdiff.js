

function listDiff(oldList, newList, key) {
    var oldMap = makeKeyIndexAndFree(oldList, key)
    var newMap = makeKeyIndexAndFree(newList, key)
    var newFree = newMap.free
    var oldKeyIndex = oldMap.keyIndex
    var newKeyIndex = newMap.keyIndex

    var moves = [], children = []
    var i = 0, item, itemKey, freeIndex = 0

    while(i<oldList.length) {
        item = oldList[i]
        itemKey = getItemKey(item, key)
        if(itemKey) {
            if(!newKeyIndex.hasOwnProperty(itemKey)) {
                children.push(null)
            } else {
                var newItemIndex = newKeyIndex[itemKey]
                children.push(newList[newItemIndex])
            }
        } else {
            var freeItem = newFree[freeIndex++]
            children.push(freeItem || null)
        }
        i++
    }

    var simulateList = children.slice(0)

    i = 0
    while(i < simulateList.length){
        if(simulateList[i] === null){
            remove(i)
            removeSimulate(i)
        } else {
            i++
        }
    }

    var j = i = 0
    while(i < newList.length){
        item = newList[i]
        itemKey = getItemKey(item, key)
        var simulateItem = simulateList[j]
        var simulateItemKey = getItemKey(simulateItem, key)

        if(simulateItem){
            if(itemKey === simulateItemKey) {
                j++
            } else {
                if(!oldKeyIndex.hasOwnProperty(itemKey)){
                    insert(i, item)
                } else {
                    var nextItemKey = getItemKey(simulateList[j+1], key)
                    if(nextItemKey === itemKey) {
                        remove(i)
                        removeSimulate(j)
                        j++
                    } else {
                        insert(i, item)
                    }
                }
            } 
        } else {
            insert(i, item)
        }
        i++
    }

    var k = simulateList.length - j
    while(j++ < simulateList.length){
        k--
        remove(k + i)
    }

    function remove(index){
        var move = {index, type: 0}
        moves.push(move)
    }

    function insert(index,item){
        var move = {index, item, type: 1}
        moves.push(move)
    }

    function removeSimulate(index){
        simulateList.splice(index, 1)
    }

    return {
        moves, 
        children
    }
}

function makeKeyIndexAndFree(list, key){
    var keyIndex = {}
    var free = []
    for(var i =0, len = list.length; i<len; i++){
        var item = list[i]
        var itemKey = getItemKey(item, key)
        if(itemKey){
            keyIndex[itemKey] = i
        } else {
            free.push(item)
        }
    }
    return {
        keyIndex,
        free
    }
}

function getItemKey(item, key){
    if(!item || !key) return void 666
    return typeof key === 'string'
        ? item[key]
        : key(item)
}

// module.exports = listDiff