

var REPLACE = 0
var REORDER = 1
var PROPS = 2
var TEXT = 3

function patch(node, patchs){
    var walker = {index: 0}
    dfsWalkPatch(node, walker, patchs)
}

function dfsWalkPatch(node, walker, patches){
    var currentPatches = patches[walker.index]
    var len = node.childNodes
        ? node.childNodes.length
        : 0
    for(var i =0; i < len; i++){
        var child = node.childNodes[i]
        walker.index++
        dfsWalkPatch(child, walker, patches)
    }
    if(currentPatches){
        applyPatches(node, currentPatches)
    }
}

function applyPatches(node, currentPatches){
    currentPatches.forEach(function(currentPatch){
        switch (currentPatch.type){
            case REPLACE:
                var newNode = (typeof currentPatch.node === 'string')
                    ? document.createTextNode(currentPatch.node)
                    : currentPatch.node.render()
                node.parentNode.replaceChild(newNode, node)
                break
            case REORDER:
                reorderChildren(node, currentPatch.moves)
                break
            case PROPS:
                setProps(node, currentPatch.props)
                break
            case Text:
                if(node.textContent){
                    node.textContent = currentPatch.content
                } else {
                    // fuck ie
                    node.nodeValue = currentPatch.content
                }
                break
            default:
                throw new Error('Unknown patch type' + currentPatch.type)
        }
    })
}

function setProps(node, props){
    for(var key in props){
        if(props[key] === void 666){
            node.removeAttribute(key)
        } else {
            node.setAttribute(key, props[key])
        }
    }
}

function reorderChildren (node, moves) {
    var staticNodeList = Array.from(node.childNodes)
    var maps = {}

    staticNodeList.forEach(function(node){
        if(node.nodeType === 1) {
            var key = node.getAttribute('key')
            if(key){
                maps[key] = node
            }
        }
    })

    moves.forEach(function(move){
        var index = move.index
        if(move.type === 0){
            if(staticNodeList[index] === node.childNodes[index]){
                node.removeChild(node.childNodes[index])
            }
            staticNodeList.splice(index, 1)
        } else if (move.type === 1) {
            var insertNode = maps[move.item.key]
                ? maps[move.item.key].cloneNode(true)
                : (typeof move.item === 'object')
                    ? move.item.render()
                    : document.createTextNode(move.item)
            staticNodeList.splice(index, 0, insertNode)
            node.insertBefore(insertNode, node.childNodes[index] || null)
        }
    })
}

patch.REPLACE = REPLACE
patch.REORDER = REORDER
patch.PROPS = PROPS
patch.TEXT = TEXT

