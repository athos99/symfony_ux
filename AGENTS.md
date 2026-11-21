# AGENTS.md — Projet Symfony UX

## Faits vérifiés

- Symfony **8.1.\***, PHP **8.5** dans le conteneur (`composer.json` exige `php >= 8.4`).
- Base **PostgreSQL** (`DATABASE_URL` dans `.env`), locale par défaut **`en`**.
- Assets gérés par **Symfony AssetMapper / importmap** : aucun `package.json` à la racine,
  donc **ne pas utiliser npm** pour les assets.
- Namespace racine `App\` → `src/`, `App\Tests\` → `tests/`.

## Environnement d'exécution (obligatoire)

Le code source est dans WSL : `/home/user/www/symfony-ux`.
Il est monté dans le conteneur Docker `php85` sous `/var/www/symfony-ux`
(montage `/home/user/www` → `/var/www`).

**Exécuter toute commande dans le conteneur, jamais sur l'hôte :**

```bash
docker exec php85 bash -c "cd /var/www/symfony-ux && <commande>"
```

Shell interactif :

```bash
docker exec -it php85 bash -c "cd /var/www/symfony-ux && bash"
```

Outils dans `php85` : `php` 8.5, `composer` 2.11, `node` 26, `yarn` 1.22.
Ne jamais lancer `php`, `composer`, `yarn`, etc. directement sur l'hôte WSL/Windows.

- URL navigateur (Windows) : `http://localhost/symfony-ux/public/`
- Xdebug est installé pour le debug et le code coverage depuis VS Code
  (variables du conteneur : `xdebug.start_with_request=yes`, `xdebug.mode=debug`,
  `xdebug.client_host=host.docker.internal`).

## Commandes utiles

```bash
# Cache
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/console cache:clear"

# Assets (AssetMapper / importmap)
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/console importmap:install"

# Migrations Doctrine
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/console doctrine:migrations:diff"
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/console doctrine:migrations:migrate"

# Tests (toute la suite, puis un filtre)
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/phpunit"
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/phpunit --filter=MaClasse"
```

## Structure

- `src/Controller/` — contrôleurs (ex. `HomeController`)
- `src/Entity/`, `src/Repository/` — Doctrine (actuellement vides)
- `src/Kernel.php`
- `templates/` — vues Twig (`base.html.twig`, `home/index.html.twig`)
- `assets/` — `app.js`, `stimulus_bootstrap.js`, `controllers/`, `styles/app.css`
- `config/packages/` — configuration par bundle
- `migrations/` — migrations Doctrine (actuellement vide)
- `tests/` — PHPUnit (seulement `bootstrap.php` pour l'instant, aucun test)
- `translations/` — fichiers de traduction (actuellement vide)
- `public/` — racine web
- `bin/console`, `bin/phpunit`

## Tests et qualité

- `phpunit.dist.xml` active `failOnDeprecation`, `failOnNotice`, `failOnWarning` :
  le code **et** les tests ne doivent produire **aucun** avertissement.
- En environnement de test : `twig.strict_variables: true` et suffixe de base `_test`
  (voir `when@test` dans `config/packages/`).
- Aucun outil de lint ou d'analyse statique (PHPStan, ECS, PHP-CS-Fixer) n'est configuré :
  ne pas en inventer. Vérification minimale = `php bin/phpunit`.

## Conventions

- Suivre PSR-12 et les conventions Symfony ; réutiliser les recipes existantes.
- Suivre le style du code existant (attributs PHP 8, classes `final`, paramètres et retours typés).
- Ne pas inventer d'informations, de commandes ou de configuration.
  En cas de doute, le signaler explicitement plutôt que deviner.
- Répondre toujours en français.