var: selected = ""
var: selected_child = ""
var: direction = ""
var: direction_to_connect = ""

style: Buttons
    color: "white"
    backgroundColor: "#c0c0c0"
    padding: "8px"
    cursor: "pointer"
end_style

style: node
    borderRadius: "8px"
    backgroundColor: "#4169E1"
    color: "white"
    fontWeight: "bold"
    cursor: "pointer"
    height: "80px"
end_style

model: node
    input: true
    placeholder: "Placeholder"
    posx: 0
    posy: 0
    linkedto: texto = ""
    linkedto: texto2 = ""
    storetextin: linked:{texto}
    style: node
end_model

event: Add_Node
    new: node,NewNode => Add_Node_Props
end_event

event: Add_Node_Right
    set: "right" > direction
    set: "left" > direction_to_connect
    new: node,NewNode => Add_Node_Child_Props
end_event

event: Add_Node_Left
    set: "left" > direction
    set: "right" > direction_to_connect
    new: node,NewNode => Add_Node_Child_Props
end_event

event: Add_Node_Top
    set: "top" > direction
    set: "bottom" > direction_to_connect
    new: node,NewNode => Add_Node_Child_Props
end_event

event: Add_Node_Bottom
    set: "bottom" > direction
    set: "top" > direction_to_connect
    new: node,NewNode => Add_Node_Child_Props
end_event

event: Delete_Node
    delete: var:{selected}
end_event

event: Connect_Here
    connect: var:{selected_child},var:{direction_to_connect},var:{direction},#4b0082
end_event

event: Add_Node_Props
    posx: 10
    posy: 80
    placeholder: "texto"
    onclick: setAsSelected
end_event

event: Add_Node_Child_Props
    posx: 10
    posy: 80
    placeholder: "texto"
    onclick: setAsSelected
    getname: selected_child
    eventtarget: var:{selected} => Connect_Here
end_event

event: setAsSelected
    getname: selected
end_event

component: Add
    text: "Adicionar nó"
    style: Buttons
    posx: 10
    posy: 20
    onClick: Add_Node
end_component

component: Add_Right
    text: "Adicionar à direita"
    style: Buttons
    posx: 120
    posy: 20
    onClick: Add_Node_Right
end_component

component: Add_Left
    text: "Adicionar à esquerda"
    style: Buttons
    posx: 273
    posy: 20
    onClick: Add_Node_Left
end_component

component: Add_Top
    text: "Adicionar acima"
    style: Buttons
    posx: 445
    posy: 20
    onClick: Add_Node_Top
end_component

component: Add_Bottom
    text: "Adicionar abaixo"
    style: Buttons
    posx: 582
    posy: 20
    onClick: Add_Node_Bottom
end_component

component: Delete
    text: "Deletar nó"
    style: Buttons
    posx: 723
    posy: 20
    onClick: Delete_Node
end_component