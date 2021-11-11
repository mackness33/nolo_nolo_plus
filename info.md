# Informazioni importanti per il progetto
## Jade and Ejs
Sono dei templates engine, cioè semplificano la creazione del lato front-end di un sito web scrivendo codice simil-javascript. A quanto pare son tutti linguaggi compilati, quindi da evitare.

## Come far partire il server
In debug mode:
> `DEBUG=app:* npm start`

## Aggiornare i package installati ogni volta che si fa un checkout
> `npm install`

## Aggiornare i package su Gocker
Aggiungere il path di npm e node prima di ```npm install``` con:
> `export PATH=$PATH:/usr/local/node/bin/` <br>
  `export PATH=$PATH:/usr/local/npm/bin/`

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

## Come gestire Workflow di git
1. Prendere tutte le modifiche che son state fatte da experimental e next
  > `git fetch` <br>
2. Ti sposti nella branch da cui vuoi creare la tua nuova branch (assicurati che sia aggiornata con `git pull` prima dei prossimi comandi)
  > `git checkout <branch_in_cui_spostarsi>`
3. Ti crei la propria branch locale per la tua task dalla branch
  > `git checkout -b <nome_nuova_branch_locale>`
4. Ci fai tutte le modifiche etc con i vari commit necessari
  > `git add .`
  > `git commit -m "Breve descrizione delle modifiche fatte"`
5. Provi a vedere se non c'è alcun conflitto con la branch su cui devi aggiungere il codice
  > `git checkout <nome_branch_principale>`
  > `git rebase <nome_nuova_branch_locale>`
6. Risolvi i conflitti e vai avanti
  > `git rebase --continue`
7. Una volta che è tutto a posto aggiungi le modifiche al remote
  > `git push`

## Sequenza di testing per le varie branch di git
- Si crea la  branch locale in cui si inizia la prima fase di testing da o experimental
o next in modo tale da avere tutto sempre aggiornato (meglio next)
- Sequenza di testing:
  > \<branch_locale\> -> (\<branch_remote_task\> ->) gocker_\<tuo_nome\> -> experimental -> next

- Esemplificazione dello schema:
  1. Prima si prova in locale (con localhost) usando la propria branch locale (\<branch_locale\>) <br>
    1bis. Se ci sono molte modifiche ed è prolungato il tempo di modifiche si può aggiungere
    la branch su remote
    1tris. Ricordarsi di eliminare la branch in remote in modo da non intasare il remote
  2. Poi si testa le modifiche sul proprio gocker personale (gocker_\<nome\>)
  3. Dopo si testa le modifiche sul gocker di gruppo per assicurarsi che sia a posto pure
  con le modifiche fatte dagli altri componenti del gruppo (experimental)
  4. Infine quando tutto funziona perfettamente si aggiunge il tutto alla branch di partenza
  (next)
