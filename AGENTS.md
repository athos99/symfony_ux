# Règles du projet Symfony UX

## Versions

- Symfony 8.x (branche 8.1.*, voir `composer.json`)
- PHP 8.5
- Node.js 26 / Yarn 1.x (pour les assets)

## Terminal Docker

Pour toute commande terminal dans ce projet, utiliser systématiquement Docker. Le
conteneur s'appelle `php85` et le projet est monté dans `symfony-ux` :

```bash
# Ouvrir un shell interactif dans le conteneur
docker exec -it php85 bash -c "cd symfony-ux && bash"

# Exécuter une commande non interactive (sans -it)
docker exec php85 bash -c "cd symfony-ux && php bin/console cache:clear"
```

Ne jamais lancer `php`, `composer`, `yarn`, etc. directement sur l'hôte :
toujours passer par le conteneur.

## Outils disponibles dans le conteneur

- `php` 8.5
- `composer` 2.x
- `node` 26, `yarn` 1.x

Utiliser de préférence **yarn** plutôt que npm. À noter : ce projet utilise
Symfony AssetMapper (importmap), il n'y a donc pas de `package.json` à la racine.

## Structure du projet

- `src/Controller/` — contrôleurs
- `src/Entity/`, `src/Repository/` — Doctrine (base PostgreSQL)
- `templates/` — vues Twig
- `assets/` — assets (gérés via AssetMapper / importmap)
- `config/` — configuration Symfony
- `migrations/` — migrations Doctrine
- `tests/` — tests PHPUnit
- `translations/` — fichiers de traduction
- `bin/console`, `bin/phpunit` — exécutables Symfony / PHPUnit

## Commandes utiles

```bash
# Vider le cache
docker exec php85 bash -c "cd symfony-ux && php bin/console cache:clear"

# Migrations
docker exec php85 bash -c "cd symfony-ux && php bin/console doctrine:migrations:migrate"

# Installer les assets (importmap)
docker exec php85 bash -c "cd symfony-ux && php bin/console importmap:install"
```

## Tests

Les tests sont lancés avec PHPUnit (config `phpunit.dist.xml`) :

```bash
docker exec php85 bash -c "cd symfony-ux && php bin/phpunit"
```

PHPUnit est configuré pour échouer sur les dépréciations, notices et warnings :
les tests doivent passer sans avertissement.

## Conventions

- Suivre les conventions de code Symfony et PSR-12.
- Utiliser les recipes Symfony existantes plutôt que d'inventer une configuration.

## Précision

Ne pas inventer d'informations. Si quelque chose n'est pas clair ou incertain, le
signaler au lieu de deviner.

Réponds toujours en français.