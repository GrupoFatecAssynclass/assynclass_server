import { FastifyInstance } from "fastify";

import fs from "fs";
import { z } from "zod";

import path from "node:path"
import { GAMES, GAME_CONTENT_VIEW, removeNullablesGames, sendContentTo, updateView } from "../../db/db";

export async function gamessRoutes(app:FastifyInstance) {
    
    //NÃO FINALIZADO
    app.post('/upload_game_file', async (req, res) => {
        const data = await req.file();

        const uploadDir = '../../public/games';
        if (!fs.existsSync(uploadDir)){ 
            fs.mkdirSync(uploadDir);
        }

        if (data){
            const fileName = `${Date.now()}-${data.filename}`;
            const filePath = `${uploadDir}/${fileName}`;

            console.log(filePath)
        }

        return res.status(200);
    });

    //FAZ O UPLOAD DO JOGO DIRETAMENTE DO EDITOR
    app.post('/upload_game', async (req, res) => {
        const paramsSchema = z.object(
            {
                teacherID: z.string(),
                gameContent: z.string(),
                gameName: z.string(),
                gameDescription: z.string()
            }
        )

        const {teacherID, gameContent, gameName, gameDescription} = paramsSchema.parse(req.body);

        const uploadDir = path.resolve(__dirname, '../../public', teacherID);
        
        if(!fs.existsSync(uploadDir)){
            fs.mkdirSync(uploadDir);
        }

        if(gameContent){
            var fileID: string = `${teacherID}_`;

            fileID += Date.now() + ".asl";

            fs.writeFile(path.join(uploadDir, fileID), gameContent, (err) => {
                if (err) throw err;
            });

            GAME_CONTENT_VIEW.push({
                id: fileID.split(".")[0],
                contentType: 1,
                teacherID,
                view: 0,
                title: (gameName != "") ? gameName : fileID.split(".")[0],
            })

            GAMES.push(
                {
                    gameID: fileID.split(".")[0],
                    gameName: (gameName != "") ? gameName : fileID.split(".")[0],
                    gameDescription: (gameDescription != "") ? gameDescription : "Sem descrição",
                    teacherID,
                    gameContent: path.join(uploadDir, fileID),
                    toStudent: []
                }
            )

            return res.status(200).send();
        }
        return res.status(401).send();

    });

    app.get('/mind_map', async (_req, res) => {
        return res.sendFile("mind_map.asl");
    })

    app.get('/templates/answer', async (_req, res) => {
        return res.sendFile("answer.txt");
    })

    app.get('/templates/alternatives', async (_req, res) => {
        return res.sendFile("alternatives.txt");
    })

    //ENVIA O CÓDIGO DO JOGO
    app.get('/games/:id', (req, res) => {

        const paramsSchema = z.object({
            id: z.string()
        })

        const {id} = paramsSchema.parse(req.params);

        const teacherID = id.split("_")[0];

        const teacherHasGame = GAMES.some(g => g.teacherID == teacherID);

        if (!teacherHasGame)
            return res.status(404).send();

        //ATUALIZA GRAFICO
        updateView(id, teacherID, 1);

        return res.sendFile(id + ".asl", path.join(__dirname, "../../public", teacherID));
    });

    //ATUALIZA O CÓDIGO DO JOGO
    app.put('/games/:id', (req, res) => {

        const paramsSchema = z.object({
            id: z.string()
        })

        const {id} = paramsSchema.parse(req.params);

        const bodySchema = z.object(
            {
                teacherID: z.string(),
                gameContent: z.string(),
            }
        )

        const {teacherID, gameContent} = bodySchema.parse(req.body);

        const teacherHasGame = GAMES.some(g => g.teacherID == teacherID);

        if (!teacherHasGame)
            return res.status(404).send();

        const uploadDir = path.resolve(__dirname, '../../public', teacherID);

        fs.writeFile(path.join(uploadDir, id + ".asl"), gameContent, (err) => {
            if (err) throw err;
        });
       
        return res.status(200).send();
    });

    //APAGA UM JOGO
    app.delete('/games/:id', (req, res) => {

        const paramsSchema = z.object({
            id: z.string()
        })

        const {id} = paramsSchema.parse(req.params);
        const teacherID = id.split("_")[0];

        const teacherHasGame = GAMES.some(g => g.teacherID == teacherID);

        if (!teacherHasGame)
            return res.status(404).send();

        const uploadDir = path.resolve(__dirname, '../../public', teacherID);

        fs.unlinkSync(path.join(uploadDir, id + ".asl"));

        let gameIndex = GAMES.findIndex(g => g.gameID == id);

        delete GAMES[gameIndex];
        removeNullablesGames();
       
        return res.status(200).send();
    });

    //ENVIAR JOGO PARA GRUPO DE ALUNOS
    app.post("/sendGame", (req, res) => {
    
        const bodySchema = z.object({
            gameID: z.string(),
            toStudents: z.number().array()
        });
    
        const {gameID, toStudents} = bodySchema.parse(req.body);
    
        const gameIndex = GAMES.map((g, index) => {
            if(g.gameID+"" == gameID)
                return index;
        }).filter(c => c !== undefined)[0];
    
        sendContentTo(gameIndex, toStudents, 1);
    
        return res.status(200).send();
    
    });

}
