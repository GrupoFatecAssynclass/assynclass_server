owner: "24680"
renderstack: r 
""
end_render_stack



event: correto
alert: "CORRETO"
render: ""
end_event
event: errado
alert: "ERRADO"
end_event

style: enunciado
fontSize: "32px"
end_style
style: botoes
fontSize: "28px"
backgroundColor: "#4b0082"
fontWeight: "bold"
color: "white"
padding: "8px"
borderRadius: "10px"
cursor: "pointer"
width: "250px"
textAlign: "center"
end_style



component: enunciado
text: "Qual o animal mais rápido do mundo?"
posx: 100
posy: 50
canmove: false
style: enunciado
end_component
component: alt1
text: "Gueopardo"
style: botoes
canmove: false
posx: 100
posy: 150
onclick: errado
end_component
component: alt2
text: "Elefante"
style: botoes
canmove: false
posx: 400
posy: 150
onclick: errado
end_component
component: alt3
text: "Leão"
style: botoes
posx: 100
posy: 250
canmove: false
onclick: errado
end_component
component: alt4
text: "Falcão-peregrino"
style: botoes
posx: 400
posy: 250
canmove: false
onclick: correto
end_component