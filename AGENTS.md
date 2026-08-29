# Règles du projet Symfony UX

## Terminal Docker

Pour toute commande terminal dans ce projet, utiliser systématiquement Docker :

```bash
docker exec -it php85 bash -c "cd symfony-ux && bash"
```

Les outils suivants sont disponibles dans ce conteneur : `php`, `node`, `yarn`, `composer`.

## Précision

Ne pas inventer d'informations. Si quelque chose n'est pas clair ou incertain, le signaler au lieu de deviner.