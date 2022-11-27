//acessando os itens para fechar as mensagens de aviso
const closeMessage = document.querySelector("#close-message");
const message = document.querySelector(".message");

//setando o trigger para sumir com a mensagem
closeMessage.addEventListener("click", () => {
   message.style.display = "none";
 });

//Definindo um intervalo de tempo para sumir com a mensagem caso o usuário não a feche
setTimeout(() => {
  message.style.display = "none";
}, 5000);