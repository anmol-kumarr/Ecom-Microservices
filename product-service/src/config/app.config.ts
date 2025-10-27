type AppConfig ={
    port?:number
}


export default ():AppConfig=>{
    return {
        port:process.env.PORT ? Number(process.env.PORT) : undefined
    }
}
