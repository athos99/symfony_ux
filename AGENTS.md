# AGENTS.md — Projet Symfony UX

## Faits vérifiés

- Symfony **8.1.\***, PHP **8.5** dans le conteneur (`composer.json` exige `php >= 8.4`).
- Base **PostgreSQL** (`DATABASE_URL` dans `.env`), locale par défaut **`en`**.
- Assets gérés par **Symfony Reprise + Vite** (`@symfony/reprise` et `vite` dans `package.json`),
  avec Yarn pour les dépendances JavaScript. Ne pas utiliser npm ; exécuter Yarn dans le conteneur `php85`.
- Reprise requiert Node.js **22.18+** ; le conteneur fournit Node.js 26.
- Les sources front sont dans `assets/`, Vite est configuré dans `vite.config.js` et les fichiers compilés
  sont publiés dans `public/build/`.
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
Ne jamais lancer `php`, `composer`, `yarn`, `vite`, etc. directement sur l'hôte WSL/Windows.

- URL navigateur (Windows) : `http://localhost/symfony-ux/public/`
- Xdebug est installé pour le debug et le code coverage depuis VS Code
  (variables du conteneur : `xdebug.start_with_request=yes`, `xdebug.mode=debug`,
  `xdebug.client_host=host.docker.internal`).

## Playwright (navigateur)

- **Chromium Playwright est installé et disponible sur l'hôte WSL** : `~/.cache/ms-playwright/`
  (`chromium-1255`, `chromium_headless_shell-1255`, version **159.0.8154.6**), dépendances système incluses.
- **Google Chrome 158.0.8127.36** est également installé (`/opt/google/chrome/chrome`) : requis par le
  MCP Playwright de Kilo, lancé avec `npx @playwright/mcp@latest --browser chrome`.
- Installation / mise à jour (sur l'hôte, hors conteneur) :
  ```bash
  npx playwright install chromium   # ou: npx playwright install chrome
  ```
- `apt-get update` émet une erreur sur les PPA `ondrej/php` et `ondrej/apache2` (changement de Label) :
  utiliser `sudo apt-get -o Acquire::AllowReleaseInfoChange=true update`.

## Commandes utiles

```bash
# Cache
docker exec php85 bash -c "cd /var/www/symfony-ux && php bin/console cache:clear"

# Dépendances front-end (après modification de package.json / yarn.lock)
docker exec php85 bash -c "cd /var/www/symfony-ux && yarn install --frozen-lockfile"

# Vite (serveur de développement)
docker exec -it php85 bash -c "cd /var/www/symfony-ux && yarn dev --host 0.0.0.0"
# Le port 5173 du conteneur doit être accessible depuis l'hôte pour HMR (http://localhost:5173).

# Compiler les assets pour la production
docker exec php85 bash -c "cd /var/www/symfony-ux && yarn build"

# Vérifier le mode et les URLs actuellement rendus par Reprise
docker exec php85 bash -c "cd /var/www/symfony-ux && cat public/build/entrypoints.json"

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
- `assets/` — `app.js`, `controllers/`, `controllers.json`, `styles/app.css`
- `vite.config.js`, `package.json`, `yarn.lock` — configuration et dépendances front-end
- `public/build/` — sortie compilée Vite / Symfony Reprise (générée, non versionnée)
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
- La génération des assets est vérifiée avec `yarn build` dans le conteneur.
- Si `public/build/entrypoints.json` contient `isProd: false` et une URL `localhost:5173`, Reprise sert
  le manifeste du serveur Vite de développement : lancer `yarn dev` dans le conteneur pour le HMR ou
  relancer `yarn build` pour revenir aux fichiers compilés. En production, vider le cache Symfony après
  le build (`php bin/console cache:clear`) car Reprise y met les entrypoints en cache.

## Conventions

- Suivre PSR-12 et les conventions Symfony ; réutiliser les recipes existantes.
- Suivre le style du code existant (attributs PHP 8, classes `final`, paramètres et retours typés).
- Ne pas inventer d'informations, de commandes ou de configuration.
  En cas de doute, le signaler explicitement plutôt que deviner.
- Répondre toujours en français.
