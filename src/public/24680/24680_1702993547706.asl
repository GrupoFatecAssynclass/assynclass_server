renderstack: r 
"54321_1702912728916"
"24680_1702989767362"
"54321_1702928943855"
end_render_stack

owner: "24680"

var: resposta = "Pele"
var: resposta_aluno = 0

event: ao_enviar
if: var:{resposta_aluno} == var:{resposta} => correto
if: var:{resposta_aluno} != var:{resposta} => errado
end_event
event: correto
alert: "CORRETO"
render: "next"
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
backgroundColor: "#1010c0"
padding: "8px"
borderRadius: "10px"
cursor: "pointer"
end_style



component: enunciado
text: "Qual o maior órgão do corpo humano?"
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