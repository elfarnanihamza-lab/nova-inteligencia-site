# Vidéo 3D du hero

`scene.html` dessine la scène (sphère de points en laiton, anneaux, impulsions, bokeh) sur un canvas 2D ; elle boucle sans
raccord sur 20 s. `render.mjs` l'enregistre avec Edge ou Chrome sans fenêtre (MediaRecorder) : aucune dépendance.

```bash
node tools/hero-video/render.mjs public/media/hero-noyau.mp4 1280 720 1300 "video/mp4;codecs=avc1.42E01E"
node tools/hero-video/render.mjs public/media/hero-noyau-mobile.mp4 640 360 700 "video/mp4;codecs=avc1.42E01E"
node tools/hero-video/render.mjs public/media/hero-noyau-poster.png 1280 720 1 poster   # puis convertir en WebP
```

Variable `BROWSER` : chemin d'un autre navigateur. Les images d'affiche (`*-poster*.webp`) sont la première image de la vidéo.
