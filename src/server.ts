import { exec } from "child_process";
import Express from "express";
import fs from "fs"
import {ErrorCommand, ErrorLintList,ExtensionList} from "./Constants"
import("dotenv/config")

const app = Express()

app.use(Express.json())


const generateFile = (code:string,ext:string) => {
    try {
        let filename = `fi${Date.now()}`
        fs.writeFileSync(`./LintFolder/${filename}.${ext}`,code,{
            encoding : "utf-8",
            flag : "w"
        })
        return filename;
    } catch (error) {
        return "error"
    }
}


app.get("/",(req:Express.Request,res:Express.Response)=>{
    res.send("Kodezi Linter test")
})


app.post("/lint",async(req:Express.Request,res:Express.Response)=>{
            const language = req.body.language
            if(language === "python"){
                //@ts-ignore
                const GenFile = generateFile(req.body.code,ExtensionList[language])
                if(GenFile === "error"){
                    res.json("failed")
                }
                //@ts-ignore
                exec(ErrorCommand(GenFile)[req.body.language],(err,stdout,stderr)=>{
                    //@ts-ignore
                    exec(`npx rimraf ./LintFolder/${GenFile}.${ExtensionList[language]}`)
                    if(stdout){
                        res.json(ErrorLintList.python(stdout))
                    }
                    else if(err){
                        res.status(403).json("Something Wrong")
                    }
                })
            }else if(language === "java"){
                    const filename = generateFile(req.body.code,"java")
                    fs.writeFileSync("filename.txt",filename,{encoding:"utf8",flag:"w"})
                    ErrorLintList.java(res,req.body.code,filename)
            }
})

//@ts-ignore
const portserve = process.env.PORT | 3500

app.listen(portserve,"0.0.0.0",()=>{
    console.log("server started: ",portserve )
})