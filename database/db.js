// Linkando MongoDB
// Extensão mongoose do nodejs para linkar o banco de dados
const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(
    "mongodb+srv://root:admin@todolist.zaffk2r.mongodb.net/?retryWrites=true&w=majority",
    {
      // Evitar erro de conexao de url ou topologia 
      // na conexão do projeto com o DB 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  // Mensagem para notificar que o DB foi conectado
  .then(() => console.log("MongoDB Atlas CONECTADO!"))
  // Se não conectar indicar erro
  .catch((err) => console.log(err));
};

module.exports = connectToDb;