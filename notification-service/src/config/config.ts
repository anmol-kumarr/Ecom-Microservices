type AppConfig = {
    port: number;
    mailUser: string;
    mailPass: string;
    rabbitMqUrl: string;
}


export default (): AppConfig => {
    return {
        port: process.env.PORT ? Number(process.env.PORT) : 3001,
        mailUser: process.env.MAIL_USER || '',
        mailPass: process.env.MAIL_PASS || '',
        rabbitMqUrl: process.env.RABBIT_MQ_URL || ''
    }
}

