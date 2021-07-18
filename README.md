# simple-virtualdom-realize
define, render, diff, min patch 

element.js: 1. 虚拟dom定义--模拟真实dom的树形结构，包含有标签名，属性，children等真实dom的对象
            2. 虚拟dom转换为真实dom
            
diff.js: 模拟实现diff算法，1. 只在同级比较，如果tagName或key值不同，删除此节点及其子节点，标记为REPLACE
                         2. 相同，对比属性，标记PROPS
                         3. text节点，标记TEXT
                         4. 比较子节点时，先对其进行排序，标记REORDER，在进行上述比较操作，
                            排序算法：老的index大于新index，dom不动，新index=Math.max(新index，旧index)，小于则移动
patch.js: 最小化更新dom
