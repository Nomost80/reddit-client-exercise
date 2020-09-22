# Getting Started
1. `npm install`
2. `cp .env.example .env.local`
3. Set your variables
3. `docker-compose --env-file .env.local up`
4. `node_modules/.bin/knex migrate:make create_bookmarks`
5. `npm run dev`
6. go to [http://localhost:3000]

# Difficultés rencontrées
* Pas d'api key possible avec Reddit
* La documentation de l'api de Reddit (je me suis trop habitué à Swagger) qui m'a induit en erreur sur certains points. J'ai perdu énormément de temps
* Le format des données (recursive comments)

# Choses à améliorer
J'aurais pu améliorer certaines choses en prenant plus de temps mais j'imagine que le but du test est aussi d'évaluer l'efficacité.
J'ai passé environ 18-20 heures.

## Résultats
* l'UX/UI complétement à revoir
* Des informations utiles sont manquantes: les commentaires en réponse à d'autres commentaires ne sont pas traités
* Les hots topics ne sont pas pris en compte (que les new)
* Pas de pagination
* Pas de gestion des erreurs et des chargements

## Techniques
* L'application n'est pas déployé
* Pas de consistence au niveau de la syntax/règles, j'aurai du setup un linter
* J'utilise le Typescript mais j'utilise quasiment aucun types
* Manque de réusabilité avec les composants, trop de dupplication et mauvais découpage. Faire des HOC aurait pu être une solution je pense
* Performance: je pense qu'il y a des problématiques de caching

# Analyse
J'avais essayé très brièvement Next.js début 2018 donc je ne partais pas de zéro.
Next a beaucoup évolué (dans le bons sens, vive les API routes !) depuis 2018 donc j'ai dû revoir certaines choses.
J'avais quelques connaissances GraphQL (seulement côté serveur) donc j'ai pu gagner du temps à ce niveau.
Et cela faisait deux ans que je n'avais pas réellement utilisé React donc j'ai du me remettre dans le bain notamment avec les hooks.

Je suis globalement assez déçu des résultats aussi bien sur le plan fonctionnel que technique. 
Surtout sur la partie frontend qui est vraiment moche.
Elle illustre bien le fait que je sois plus à l'aise sur le backend