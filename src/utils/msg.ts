
import clc from 'cli-color'
import console from 'console'


export const warn = (msg:string)=>{ 
    console.log("")
    console.log(clc.red("【WARN】:"),clc.white( ` ${msg} ` ))
}

export const info = (msg:string)=>{ 
    console.log("")
    console.log(clc.yellow("【INFO】:"),clc.bold( clc.bgWhite(clc.blue(` ${msg} `))))
}

export const title = (msg:string,color?:string,indent ?: number) =>{      
        let indents = "" 
        for(let i =0;i<(indent? indent:7);i++) indents = indents + "\t" 
        console.log("") 
        console.log(`${indents} ${clc.bold(clc[color ? color : "blue" ](msg))  } ${indents}`) 
        console.log("")
}

export const log = (o:object,tit?:string,color?:string,indent ? : number) =>{ 
    if(tit) title(tit,color,indent) 
    Object.keys(o).forEach(k=>{
        info(`${k} --> ${o[k]}`)
    })
}