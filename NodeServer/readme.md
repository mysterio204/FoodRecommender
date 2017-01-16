#NodeServer
Um den Server zu starten:
cd "PATH_TO_FOLDER"
node app.js


##API:
Base-URL:
localhost:3333/api/get

Dummy-Daten
(20 random Rezepte)

    localhost:3333/api/get/recommended
Alle Rezepte
(momentan auf 20 beschränkt)

    localhost:3333/api/get/all

Zutatenliste für Profilerstellung
(noch nicht implementiert)

    localhost:3333/api/get/zutaten


Einzelnes Rezept
(recipes_href aus Datenbank)

    localhost:3333/api/get/single/{recipes_href}

Liste an bestimmten Rezepten
(recipes_href aus Datenbank)

    localhost:3333/api/get/favorites/["recipes_href" , "recipes_href"]