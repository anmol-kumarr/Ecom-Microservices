type AppConfig ={
    port?:number
    rabbitMQ?:string
}


export default ():AppConfig=>{
    return {
        port:process.env.PORT ? Number(process.env.PORT) : undefined,
        rabbitMQ:process.env.RABBIT_MQ_URL

    }
}
