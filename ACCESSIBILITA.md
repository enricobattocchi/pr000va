# Verifica di accessibilità

Verifica del 30 ottobre 2026, riferimento WCAG 2.2 livello AA.

## Esito e perimetro

axe-core, regole WCAG A/AA 2.0, 2.1 e 2.2: nessuna violazione rilevata nei sei stati provati (pagina, condivisione, preferite vuote, preferite popolate, editor con errore, informazioni). Controlli ripetuti a 320 px, anche con testo al 200% e spaziatura aumentata. Nessuno scorrimento orizzontale rilevato a 320 px.

Verificati manualmente nel browser: conversione MA551MO in MASSIMO, Tab dall’editor al pulsante Salva, apertura della modale da tastiera, raggiungibilità di Scarica, Escape e ritorno del focus a Condividi. Il centro di Scarica coincide con il centro della modale.

Contrasti calcolati: bianco su blu #07549b 7,64:1; giallo su blu 5,72:1; errore rosso su fondo chiaro 5,79:1; watermark 6,97:1. Le segnalazioni automatiche da verificare manualmente riguardano SVG, icone decorative e l’input trasparente sovrapposto al testo colorato. Quest’ultimo espone il valore alle tecnologie assistive e ripristina testo visibile in modalità colori forzati.

## Correzioni

- Nome accessibile della modale e ritorno del focus al controllo di apertura.
- Pulsante nativo per modificare la parola e titolo di primo livello conservato.
- Istruzioni dell’editor associate al campo; errori con caratteri, posizioni e alternative, oltre a colore e sottolineatura.
- Annuncio separato dei risultati e degli stati; focus mantenuto dopo aggiornamenti dello storico e delle preferite.
- Collegamento per saltare al generatore, focus visibile e supporto alle preferenze di movimento ridotto.
- Controlli più grandi, contrasto migliorato, contenuti in flusso per evitare sovrapposizioni quando il testo cresce.
- Comandi e quinta voce dello storico disponibili anche su schermi stretti.

## Limiti

Questo controllo non è una certificazione di conformità. Non sono stati eseguiti test con NVDA, JAWS o VoiceOver, né con tutti i browser e le impostazioni di alto contrasto. La verifica con lettori di schermo reali, dispositivi touch e persone con disabilità resta necessaria per una valutazione completa. Il controllo del testo al 200% usa una copia di prova con dimensione base aumentata; non sostituisce tutte le combinazioni di zoom e browser.

Riferimento: https://www.w3.org/WAI/WCAG22/quickref/
