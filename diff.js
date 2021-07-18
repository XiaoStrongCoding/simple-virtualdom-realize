// var patch = require('./patch')
// var _ = require('./util')
// var listDiff = require('./listdiff')


function diff(oldTree, newTree){
    var index = 0
    var patchs = {}
    dfsWalk(oldTree, newTree, index, patchs)
    return patchs
}

function dfsWalk(oldNode, newNode, index, patchs){
    var currentPatch = []
    if(newNode === null){

    } else if(_.isString(oldNode)&&_.isString(newNode)){
        if(oldNode!==newNode){
            currentPatch.push({type: patch.Text, content: newNode})
        }
    } else if(
        oldNode.tagName === newNode.tagName &&
        oldNode.key === newNode.key
    ){
        var propsPatchs = diffProps(oldNode, newNode)
        if(propsPatchs){
            currentPatch.push({type: patch.PROPS, props: propsPatchs})
        }

        if(!isIgnoreChildren(newNode)){
            diffChildren(
                oldNode.children,
                newNode.children,
                index,
                patchs,
                currentPatch
            )
        }
    } else {
        currentPatch.push({type: patch.REPLACE, node: newNode})
    }

    if(currentPatch.length){
        patchs[index] = currentPatch
    }
}

function diffChildren(
    oldChildren,
    newChildren,
    index,
    patchs,
    currentPatch
){
    var diffs = listDiff(oldChildren, newChildren, 'key')
    newChildren = diffs.children

    if(diffs.moves.length){
        var reorderPatch = {type: patch.REORDER, moves: diffs.moves}
        currentPatch.push(reorderPatch)
    }

    var leftNode = null
    var currentNodeIndex = index
    oldChildren.forEach(function(child, i){
        var newChild = newChildren[i]
        currentNodeIndex = (leftNode && leftNode.count)
            ? currentNodeIndex + leftNode.count + 1
            : currentNodeIndex + 1
        dfsWalk(child,newChild,currentNodeIndex,patchs)
        leftNode = child
    })
}

function diffProps(oldNode, newNode){
    let count = 0
    let oldProps = oldNode.props
    let newProps = newNode.props

    let key, value
    let propsPatchs = {}

    for(key in oldProps){
        value = oldProps[key]
        if(newProps[key]!==value){
            count++
            propsPatchs[key] = newProps[key]
        }
    }

    for(key in newProps){
        value = newProps[key]
        if(!oldProps.hasOwnProperty(key)){
            count++
            propsPatchs[key] = value
        }
    }

    if(count === 0){
        return null
    }

    return propsPatchs
}

function isIgnoreChildren(node){
    return node.props && node.props.hasOwnProperty('ignore')
}

// module.exports = diff