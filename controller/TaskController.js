const Task =  require("../models/Task");

const {google} = require('googleapis');
const { stringify } = require("querystring");
require('dotenv').config();


// Chamando as credenciais da conta do Google Calendar e a ID da Agenda utilizada
const CREDENTIALS = { "type": "service_account",  "project_id": "nodejs-api-369402",  "private_key_id": "4e4b7a13e4b616bc6d9dcc1100c8ea074c03d666",  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSoCFacMDqlnKA\nFiR777D53+yr7Host3AewTQnlxH/v+w7Qbu2nm6EwW3qYSkLXumiGX97T3U+NlOE\nZfUxQNG74vJGy2jj6TXH+i9omQ7f1//y2gx22PpaYjIuqnBSHD2A9C3HYl4l2vUV\nnfP7pF5g2F2W74+pBTr+84OI18CduHpBwtk8xjS9x/0y0r0ThaYXdH3gP5aHF0qI\nMmjYv6YyMc9j6vaJU3RZ+zw26Lb0ccbGfGl+c65td4rFY7T3+A4JkCe+UX4c7nEN\ndB8xtmHJ6df6C3ZzFULVVZXsK0lwu4Jkug/Z1e7/IPXJjyKImxG+Z5ynz7vTry3j\nxBBJx4w9AgMBAAECggEABLwJvo/d851UeebwL1hYzj0c2P5/U+WptQnwbgVk0lln\nlNYU7fV2FDDe6M+sowShVCimPMjb9f01omUXqQxFH/0+0fLnlYab/rXz09zrldeJ\nTtWyRbJPP7HeYT3T5DHzUKSXKi4JYhN1F+Ui42CzUxJPWZcNT9DTcytZJRMofBhr\njK8LV6lPwVNfn2CtKKRdFAjFo/OO89oRD+5p3vF/5A+6yjHF4lgQ2SQiL+FiOPS6\n2KmKeuVhQx1AmM3TEnByuVLhpEthyNIfoFY3f+nXVoYLxqP6Q06kwxgw1tzCb57W\nSQccalZ2mUQtxi0VsjHXy79B+1xYNAEzUVLppo6VsQKBgQDtLQ7sjrKP4Z9oAqM5\nSyt3oTqeToTYrm4ufkEzhbfItHEphz2Y/YPEpHOk6XY6ax4PMz6uQJvDC8cjUNE8\nF9xedMg8bVvgqLptKecJULkR4tmsmgZK/2+GvS+0VA2LxOj0zvLK8v7bKn5e45w/\nQh89FOXtM1TBHj7l6J7AlnWrZQKBgQDjV551bzOEbVNPwBPZZgVBA/6sJp7PNeNA\nlwXkmgLxAFpKhv68jUwMEE0sqPTjEBGwF7TbznLmSQKt0xczO4oXewPR20fMDGNv\nou8YHYUaUP/XJgWmYJPLfXAugm9dC0O55G4ENVIfFgrRkpcR20HvqyXr0kMoSwSZ\nrh+NXfSL+QKBgANY+HX0SaboO1S/fMhJPFLS7r3fQ9a/F4UGeSsd/wsRKOu6Ie9v\n3JVA8PTp6qZGbsUuJvtUpB4ro2LnOBzOBWk74rufm4VfPEpgJgemoQYUmpfqEJ6s\nXkmbj/nOmeZYICWcaibdKSW0wtXaBpGKAGDfU6N2bwLOx3p9Pwhe10hVAoGAal/Q\nFDDRETC6X8GHSBzVboN5AYIcouYbDFjd+AYcRDofBWo+/Wi74ZUrFy+DTk9xh0zA\nYm0qFBireTwhSeadCbmUovgQkyhkypKZf1YotpSZ8UioMh5UaU2rVQfRJd8kdHGv\nDKcKYuNEcqU9rKxEIOmbF8nNhKf9Yg84UkRZLbkCgYBT6kdXOMkZYvYpCFKnG8go\nenLfDxi64OH/VQKKB5BoSU11Vw0PT1hlwB6zVqkr7LvGeB6hJw4cbYfhXSC1r5x9\nvh3c9sFoGmbi0bGang+II/HfNHLmteBsEL3K61hAZOl1aM98ky6lPYvvXXlMzG4c\n9tP5jUwh7q0nk1SRqCqfog==\n-----END PRIVATE KEY-----\n",  "client_email": "gapinode@nodejs-api-369402.iam.gserviceaccount.com",  "client_id": "111751110548111583519",  "auth_uri": "https://accounts.google.com/o/oauth2/auth",  "token_uri": "https://oauth2.googleapis.com/token",  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/gapinode%40nodejs-api-369402.iam.gserviceaccount.com"};
const calendarId = "c461d857aa2273099567c4874bed3dc8bef3402e4721eca884a12bf68194099f@group.calendar.google.com";

// Parametros da API do Google Calendar
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);

// Fuso Horario
const TIMEOFFSET = '-03:00';

// string no formato data-horario pro calendario
const dateTimeForCalander = () => {

    let date = new Date();

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Setando o final do evento para 1 hora depois do inicio
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+1));

    return {
        'start': startDate,
        'end': endDate
    }
};

// Inserindo um evento novo no calendario
const insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};



let message = "";
let type = "";


// retornando mensagem de sucesso (ou não) da inclusão no MongoDB
const getAllTasks = async (req, res) => {
  try{
    //timeout para que as mensagens de alerta sumam ao recarregar a página
    setTimeout(() => {
      message = "";
    }, 1000);
    const tasksList = await Task.find();
    return res.render("index", {
      tasksList,
      task: null,
      taskDelete: null,
      message,
      type
    });
  } catch (err){
    res.status(500).send({error: err.message})
  }
};
// Pegando as tarefas do body e inserindo dentro do MongoDB
const createTask = async (req, res) => {
  const task = req.body;
  let dateTime = dateTimeForCalander();
  
  

  //se a tarefa estiver vazia, emite mensagem 
  if(!task.task){
    message = "Insira um texto, antes de adicionar a tarefa!"
    type = "danger"
    return res.redirect("/")
  }
  
  //espera a criação da tarefa e retorna mensagem de sucesso
  try {
    await Task.create(task)
    console.log(JSON.stringify(task.task).replace(/[^\w\s]/gi, ''))

    const event = {
      'summary': JSON.stringify(task.task).replace(/[^\w\s]/gi, ''),
      'start': {
          'dateTime': dateTime['start'],
          'timeZone': 'America/Sao_Paulo'
      },
      'end': {
          'dateTime': dateTime['end'],
          'timeZone': 'America/Sao_Paulo'
      }
  };

  await insertEvent(event)
    .then((res) => {
        console.log(res);
        
    })
    .catch((err) => {
        console.log(err);
    });

    message = "Tarefa criada com sucesso!"
    type = "success"
    return res.redirect("/") 
    
  } catch(err){
    res.status(500).send({error: err.message})
  }
  
};

  // permitindo alteração e exclusão de tarefas pela página
  
const getById = async (req, res) => {
  try {
    const tasksList = await Task.find();
    if (req.params.method == "update") {
      const task = await Task.findOne({ _id: req.params.id });
      res.render("index", {
        task,
        taskDelete: null, 
        tasksList,
        message,
        type});
    } else {
      const taskDelete = await Task.findOne({ _id: req.params.id });
      res.render("index", { 
        task: null, 
        taskDelete, 
        tasksList,
        message,
        type});
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// criando const para alteração de task
const updateOneTask = async (req, res) => {
  try{
    const task = req.body;
    await Task.updateOne({ _id: req.params.id }, task);
    message = "Tarefa atualizada com sucesso!"
    type = "success"
    res.redirect("/");
  }catch (err) {
    res.status(500).send({error: err.message});
  }
};

// criando const para delete de task
const deleteOneTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    message = "Tarefa apagada com sucesso!"
    type = "success"
    res.redirect("/");
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

// Mecanismo para marcar as tarefas como feitas
const taskCheck = async (req, res) => {
  try{
    
  // Pegando uma tarefa específica
    const task = await Task.findOne({ _id: req.params.id});
    
  //Se o check estiver como true vai mudar pra false e vice versa utilizando condicional ternária
    
    task.check ? task.check = false : task.check = true;
    
    //Atualizando no BD o status true ou false e atualizando a página
    await Task.updateOne({ _id: req.params.id}, task);
    res.redirect("/");
    
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  getById,
  updateOneTask,
  deleteOneTask,
  taskCheck
};