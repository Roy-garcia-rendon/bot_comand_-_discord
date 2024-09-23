// requerimiento
const Discord = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
// definir cliente 
const Client = new Discord.Client({
    intents: 3276799,
});
//cargar comandos
Client.commands = new Discord.Collection();

fs.readdirSync("./slash_commands").forEach((commandfile) => {
const command = require(`./slash_commands/${commandfile}`);
Client.commands.set(command.data.name, command);
});
//registrar comandos
const REST = new Discord.REST().setToken(config.CLIENTE_TOKEN);

(async () => {
    try{
        await REST.put(
            Discord.Routes.applicationGuildCommands(config.clienteId, config.guildId),
            {
                body: Client.commands.map((cmd) => cmd.data.toJSON()),
            }
        );
        console.log('loaded ${Client.commands.size} slash commands {/}');
    } catch (error){
        console.log("Error loading commands.", error)
    }
})();

// primer evento
Client.on(Discord.Events.ClientReady, async () => {
    console.log('conectado como kevgod')
});
//evento interactioncreate: se ejecuta cunado el usuario de la comunidad utiliza una intereaccion
Client.on("interactionCreate", async (interaction) =>{
    //si la interaccion es un slash comamand
    if(interaction.isChatInputCommand()){
        //obtiene los datos del comando
        const command = Client.commands.get(interaction.commandName);
        //ejecuta el comando
        command.execute(interaction).catch(console.error);
        //si la interracion boton,menu
    }
});

// conectar
Client.login(config.CLIENTE_TOKEN)