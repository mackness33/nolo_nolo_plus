# Informazioni importanti per il progetto
## Jade and Ejs
Sono dei templates engine, cioè semplificano la creazione del lato front-end di un sito web scrivendo codice simil-javascript. A quanto pare son tutti linguaggi compilati, quindi da evitare.

## Come far partire il server
In debug mode:
> `DEBUG=app:* npm start`

## Aggiornare i package installati ogni volta che si fa un checkout
> `npm install`

## Connettersi al server mongoDB su Gocker
Bisogna connettersi ad una macchina di laboratorio, da cui ci si deve poi collegare a gocker usando il comando
> `ssh gocker.cs.unibo.it`


La connessione al server remoto funziona utilizzando 2 container:
- Un container che esegue il server mongo. la creazione e partenza del server avviene con 
  > `start mongo nome.cognome`
  
    che fornira' successivamente nome utente, password e host per connettersi a mongoDB <br>
    (password potrebbe non funzionare).
    
    per fermare il database bisogna usare il comando
    
    > `stop mongo nome.cognome`
- Un container che esegue lo script node.js che gli viene fornito. Per crearlo si usa il comando
  > `create node-15 nome.cognome path\to\app.js`
  
  notare che il path viene evalutato a partire da `home/web/nome.cognome/html/`.<br>
  Una volta creato bisogna farlo partire con il comando
  > `start node-15 nome.cognome path\to\app.js`
  
  e da ora si possono osservare gli output dell'esecuzione usando il comando
  > `logs nome.cognome`
  
  inoltre, se si fa qualche modifica allo script passato al container node, si puo' far ripartire il sito web usando
  > `restart nome.cognome`
  
Infine, l'uri da passare a mongoose/MongoClient per connettersi al server e':<br>
`mongodb://nome.cognome:password@mongo_nome.cognome:27017?writeConcern=majority`<br>
Esso permette di collegarsi solo al database `test` presente nel container mongo.

L'utilizzo di 2 container fa in modo che la porta `27017` per comunicare con il server sia accessibile solo da un altro container,
nel nostro caso quello che sta eseguendo node.js
Inoltre e' questo stesso script a contenere la entry point per potercisi connettere dal web, tale entry point e' obbligatoriamente la porta 8000.
