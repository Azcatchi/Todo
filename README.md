# Todo List

L'application TodoList permet de créer des Todos pour un utilisateur ou encore les attribuer un autre utilisateur de la même team. Après le clone du repository Git, effectuer la commande npm install. La base de donnée principale est MongoDb, la gestion des sessions est effectuée au travers de Redis.

**Lancement de l'application**

>mongod
Terminal 1

>mongo
Terminal 2

>redis-server
Terminal 3

>npm start app.js
Terminal 4

**Accès**

Compte administrateur pour gérer les Team(s) :
admin/admin

Compte utilisateur simple :
test/test

**Liste des routes**

/ -> Interface de connexion

/users/create -> Créer un compte utilisateur

/users/admin -> Administration des teams

/todos -> Interface menu todos

/todos/user -> Todo(s) affectée(s) à un user

/todos/team -> Todo(s) affectée(s) à une team

/todos/create -> Création d'une todo
