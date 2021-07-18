// 虚拟dom
function Element(tagName, props={}, children=[]){
    this.tagName = tagName
    this.props = props
    this.children = children
    const {key = void 666} = this.props
    this.key = key

    let count = 0
    this.children.forEach((child,index)=>{
        if(child instanceof Element){
            count += child.count
        }
        count++
    })
    this.count = count
}


// 将虚拟dom转换为真实dom
Element.prototype.render = function(){
    const el = document.createElement(this.tagName)
    const props = this.props
    for(const prop in props){
        const propValue = props[prop]
        el.setAttribute(prop, propValue)
    }
    this.children.forEach(child=>{
        let childEle
        if(child instanceof Element){
            childEle = child.render()
        }else{
            childEle = document.createTextNode(child)
        }
        el.appendChild(childEle)
    })
    return el
}