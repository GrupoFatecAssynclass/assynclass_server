import Bard from "bard-ai";
import { FastifyInstance } from "fastify";
import { ALUNOS, CHATS, PROFESSORES, addMessage } from "../../db/db";
import { z } from "zod";
import WebSocket, { WebSocketServer } from "ws";

interface BardChats{
    //Any porque a API não tem um tipo pra chat
    [key: string] : any
}

export function initializeChatServer(){
    //SERVIDOR DO CHAT
    const server = new WebSocketServer({ port: 8080 });
    let bardChats : BardChats = {};
    let bard = new Bard("egh1KEkn8fB6qZQ8dvKPOGtdNj51jcRuEPznqLi2gM3tEHrbeVt2gTr4LBB0TuK-DesVpA.");

    server.on("connection", (socket:any) => {

        //Quando o servidor recebe uma mensagem do usuário
        socket.on("message", (data: any) => {

            //Todas as mensagens enviadas pelo Cliente vem em formato hexadecimal, então precisa-se converte-la
            const b = Buffer.from(data)
            const data_decoded = JSON.parse(b.toString());
            
            if(data_decoded.func == "add_user"){
                socket.id = data_decoded.userID;
                bardChats[String(data_decoded.userID)] = bard.createChat();
            }
            
            else if(data_decoded.func == "message_to"){

                if(data_decoded.secondUser == -1){

                    let message: string;

                    //Alterar o código para manter tudo na mesma conversa
                    bardChats[String(data_decoded.firstUser)].ask(data_decoded.msg).then((res : string) => {
                        message = String(res);

                        let splited = message.split("\n").map(line => {
                            if(line.startsWith("![Image")){
                                let image_link = line.split("(")[1];
                                image_link = image_link.substring(0, image_link.length-1);
                                return image_link;
                            }
                            return line;
                        }).join("\n");

                        message = splited;
                    
                        server.clients.forEach((c: any) => {
                            if(c.readyState == WebSocket.OPEN && c.id == data_decoded.firstUser){
                                c.send(JSON.stringify({
                                    msgID: Math.random()+"",
                                    sendedBy: -1,
                                    msg: message
                                }))
                            }
                        });
                    });

                }
                else{
                    //Adiciona a mensagem ao banco de dados para que possa ser recuperado quando necessario
                    fetch("http://localhost:3333/addMessage", {
                        method: "POST",
                        body: JSON.stringify({
                            firstUser: data_decoded.firstUser+"",
                            secondUser: data_decoded.secondUser+"",
                            data: JSON.stringify({
                                sendedBy: data_decoded.firstUser+"",
                                msg: data_decoded.msg
                            })
                        }),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                        }
                    })
    
                    server.clients.forEach((c: any) => {
                        //Envia mensagem do primeiro usuário para o segundo
                        if(c.readyState == WebSocket.OPEN && c.id == data_decoded.secondUser){
                            c.send(JSON.stringify({
                                msgID: Math.random()+"",
                                sendedBy: data_decoded.firstUser,
                                msg: data_decoded.msg
                            }))
                        }
                    })
                }

            }

        });
    });
}

export async function chatRoutes(app:FastifyInstance) {

    //ROTA PARA CRIAR UM CHAT ENTRE PROFESSOR-ALUNO
    app.post("/createChat", (req, res) => {

        //Professor sempre será o secondUser
        const bodySchema = z.object({
            firstUser: z.string(),
            secondUser: z.string()
        })
    
        const {firstUser, secondUser} = bodySchema.parse(req.body);
        
        const exists = CHATS.map(c => {
            if(c.firstUser == firstUser && secondUser == c.secondUser)
                return c;
        }).filter(c => c !== undefined);
    
        if(exists.length == 0){
            CHATS.push({
                idChat: firstUser+"_"+secondUser,
                firstUser: firstUser,
                secondUser: secondUser,
                messages: []
            })
        }
    
        return res.status(200).send();
    })

    //ROTA PARA BUSCAR O SEGUNDO USUÁRIO DO CHAT
    app.get("/chats/:id/:type", (res, r) => {

        const userSchema = z.object({
            id: z.string(),
            type: z.string()
        })
    
        const {id, type} = userSchema.parse(res.params);
    
        const response = CHATS.map(c => {
            if(id == c.firstUser || id == c.secondUser){
    
                const aluno = ALUNOS.map(a => {
                    if(c.firstUser == String(a.studentID))
                        return a;
                }).filter(a => a !== undefined)
    
                const prof = PROFESSORES.map(a => {
                    if(c.secondUser == String(a.teacherID))
                        return a;
                }).filter(a => a !== undefined)
    
                return {
                    idChat: c.idChat,
                    secondUser: (Number(type) == 0) ? c.secondUser : c.firstUser,
                    secondUserName: (Number(type) == 0) ? prof[0]?.teacherName : aluno[0]?.studentName,
                    messages: c.messages,
                };
            }
        }).filter(c => c !== undefined);
    
    
        return r.send(response);
    })
    
    //ROTA PARA BUSCAR MENSAGENS DE UM CHAT EM ESPECIFICO
    app.get("/chats/:id/:type/:idSecond", (res, r) => {
    
        const userSchema = z.object({
            id: z.string(),
            idSecond: z.string(),
            type: z.string()
        })
    
        const {id, idSecond} = userSchema.parse(res.params);
    
        const messages = CHATS.map((c) => {
            if(c.firstUser == id && idSecond == c.secondUser || c.secondUser == id && idSecond == c.firstUser)
                return c;
        }).filter(c => c !== undefined)[0];
    
        return r.send(messages?.messages);
    })

    //ROTA PARA ADICIONAR UMA MENSAGEM
    app.post("/addMessage", (req, res) => {
    
        const bodySchema = z.object({
            firstUser: z.string(),
            secondUser: z.string(),
            data: z.string()
        });
        
        const {firstUser, secondUser, data} = bodySchema.parse(req.body);
        
        const chatIndex = CHATS.map((c, index) => {
            if(c.firstUser == firstUser && secondUser == c.secondUser)
                return index;
            else if (c.secondUser == firstUser && secondUser == c.firstUser)
                return index;
        }).filter(c => c !== undefined)[0];
        
        addMessage(chatIndex, data);
    
        return res.status(200).send();
    })
}