renderstack: renderizar
"24680_1702989767362"
"54321_1702912728916"
end_render_stack

owner: "54321"
event: correto
alert: "CORRETO"
points: 30
render: "next"
end_event
event: errado
alert: "ERRADO"
end_event

style: enunciado
fontSize: "32px"
end_style
style: botoes
fontSize: "28px"
backgroundColor: "#10b981"
fontWeight: "bold"
color: "white"
padding: "8px"
borderRadius: "10px"
cursor: "pointer"
width: "250px"
textAlign: "center"
end_style



component: enunciado
text: "Em que planeta moramos?"
posx: 100
posy: 50
canmove: false
style: enunciado
end_component
component: alt1
text: "Mercúrio"
style: botoes
canmove: false
posx: 100
posy: 150
onclick: errado
end_component
component: alt2
text: "Vênus"
style: botoes
canmove: false
posx: 400
posy: 150
onclick: errado
end_component
component: alt3
text: "Terra"
style: botoes
posx: 100
posy: 250
canmove: false
onclick: correto
end_component
component: alt4
text: "Marte"
style: botoes
posx: 400
posy: 250
canmove: false
onclick: errado
end_component