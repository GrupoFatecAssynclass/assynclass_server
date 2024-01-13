owner: "54321"

var: resposta = 2
var: resposta_aluno = 0

event: ao_enviar
if: var:{resposta_aluno} == var:{resposta} => correto
if: var:{resposta_aluno} != var:{resposta} => errado
end_event
event: correto
alert: "CORRETO"
points: 20
render: ""
end_event
event: errado
alert: "ERRADO"
end_event

style: enunciado
fontSize: "32px"
end_style
style: resposta_aluno
fontSize: "24px"
end_style
style: enviar
fontSize: "24px"
color: "white"
fontWeight: "bold"
backgroundColor: "#10b981"
padding: "8px"
borderRadius: "10px"
cursor: "pointer"
end_style



component: enunciado
text: "Quanto é 1 + 1?"
canmove: false
posx: 100
posy: 50
style: enunciado
end_component
component: resposta_aluno
input: true
placeholder: "Digite a resposta aqui"
posx: 100
posy: 120
style: resposta_aluno
storetextin: resposta_aluno
canmove: false
end_component
component: enviar
text: "Enviar"
posy: 180
posx: 100
canmove: false
style: enviar
onclick: ao_enviar
end_component