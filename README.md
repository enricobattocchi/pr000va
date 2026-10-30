# PR·000VA

**Pareidolia da tamponamento.**

Generatore umoristico di targhe italiane di fantasia. HTML, CSS e JavaScript senza dipendenze online.

## Avvio

Apri `index.html` nel browser, anche offline. Per sviluppare puoi avviare `python3 -m http.server 8765` e aprire http://localhost:8765.

## Funzioni

- Generazione da un repertorio revisionato di 792 targhe.
- Clic sulla parola per modificarla direttamente, con anteprima immediata e lettere non convertibili in rosso. Servono sette lettere. Invio o clic fuori confermano un testo valido; Esc annulla.
- Switch per escludere I, O, Q e U dalle quattro lettere esterne.
- Preferiti e storico salvati nel browser, senza inviare dati online.
- Condivisione della sola targa: PNG 1560 × 330, angoli arrotondati, trasparenza esterna e watermark. Condivisione nativa di file dove supportata, altrimenti download.

La forma è **AA·123AA**. Le tre cifre si leggono come lettere: 0→O, 1→I, 2→Z, 3→E, 4→A, 5→S, 6→G, 7→T, 8→B. Gli allungamenti sono esclamazioni scelte a mano, mai generati automaticamente. Le parole personalizzate restano nello storico personale.

Il salvataggio dipende dalle impostazioni del browser; cambiare browser o spostare i file può cambiare lo spazio di salvataggio disponibile.

## Struttura

`index.html` contiene la pagina; `assets/stile.css` la grafica; `assets/app.js` le interazioni e l’export; `assets/motore.js` la conversione; `assets/repertorio.js` le parole. Immagine e font sono locali.

## Controlli

Con Node.js: `node tests/repertorio.cjs` e `node --check assets/app.js`.

## Licenze

Vedi `CREDITI.md` e `LICENSE`. Le targhe sono di fantasia e non sono destinate alla circolazione.

Un’idea di [Lopo.it](https://lopo.it).
