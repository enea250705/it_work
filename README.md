# IT Solutions - Mini Clone Website

Un clone moderno e responsive di un template Wix per aziende IT, realizzato con HTML, CSS e JavaScript vanilla.

## 🚀 Come Visualizzare il Sito

### Metodo 1: Server Locale (Consigliato)

**Opzione A: Usa il file batch**
1. Fai doppio clic su `start-server.bat`
2. Apri il browser e vai a: `http://localhost:8000`
3. Naviga tra le pagine usando il menu

**Opzione B: Comando manuale**
1. Apri PowerShell nella cartella del progetto
2. Esegui: `python -m http.server 8000`
3. Apri il browser e vai a: `http://localhost:8000`

### Metodo 2: Aprire direttamente

1. Fai doppio clic su `index.html`
2. Il sito si aprirà nel browser
3. Nota: alcune funzionalità potrebbero non funzionare correttamente senza un server

## 📁 Struttura del Progetto

```
lavoro_it/
│
├── index.html          # Pagina Home
├── services.html       # Pagina Servizi
├── about.html          # Pagina Chi Siamo
├── contact.html        # Pagina Contatti
├── styles.css          # Stili CSS completi (condivisi)
├── script.js           # JavaScript per interattività (condiviso)
├── start-server.bat    # Script per avviare il server locale
└── README.md          # Documentazione
```

## 📄 Pagine del Sito

1. **Home (index.html)** - Pagina principale con hero section, preview servizi e chi siamo
2. **Servizi (services.html)** - Pagina dedicata con descrizioni dettagliate di tutti i servizi
3. **Chi Siamo (about.html)** - Storia aziendale, missione, valori e statistiche
4. **Contatti (contact.html)** - Form di contatto completo, informazioni e mappa
5. **Footer** - Presente su tutte le pagine con link rapidi e social media

## ✨ Caratteristiche

- ✨ Design moderno e professionale
- 📱 Completamente responsive (mobile, tablet, desktop)
- 🎨 Animazioni fluide e transizioni eleganti (stile Wix)
- 🚀 Performance ottimizzate
- ♿ Accessibilità migliorata
- 🎯 Navigazione smooth scroll
- 📧 Form di contatto funzionale
- 🎭 Animazioni al scroll con effetti parallax
- 💫 Animazioni scaglionate (stagger)
- 🎪 Effetti hover avanzati

## 🎨 Animazioni Implementate

- **Fade-in al scroll** con direzioni multiple (up, down, left, right, scale)
- **Parallax multi-layer** nella hero section
- **Animazioni scaglionate** per elementi in griglia
- **Contatori animati** per le statistiche
- **Effetti hover** avanzati su card e pulsanti
- **Transizioni di pagina** fluide
- **Animazioni form** con feedback visivo

## 🛠️ Personalizzazione

### Cambiare i Colori

Modifica le variabili CSS in `styles.css`:

```css
:root {
    --primary-color: #4a90e2;      /* Colore principale */
    --primary-dark: #357abd;       /* Colore principale scuro */
    --secondary-color: #2c3e50;   /* Colore secondario */
    /* ... */
}
```

### Modificare i Testi

Tutti i testi sono direttamente modificabili nei file HTML corrispondenti:
- **Home**: `index.html`
- **Servizi**: `services.html`
- **Chi Siamo**: `about.html`
- **Contatti**: `contact.html`

### Aggiungere Immagini

Per aggiungere immagini reali invece dei placeholder SVG:
1. Aggiungi le immagini nella cartella del progetto
2. Sostituisci il contenuto SVG con tag `<img>`:

```html
<img src="path/to/your/image.jpg" alt="Description">
```

## 🌐 Browser Supportati

- Chrome (ultime 2 versioni)
- Firefox (ultime 2 versioni)
- Safari (ultime 2 versioni)
- Edge (ultime 2 versioni)

## 📦 Tecnologie Utilizzate

- HTML5
- CSS3 (con CSS Variables, Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Google Fonts (Inter)

## 📝 Note

- Il form di contatto attualmente mostra un alert. Per un'implementazione completa, integra con un backend o un servizio di email.
- Le animazioni utilizzano CSS e JavaScript vanilla per performance ottimali.
- Il design è completamente responsive e si adatta a tutti i dispositivi.
- Le animazioni sono ottimizzate per performance e si attivano solo quando visibili.

## 📞 Supporto

Per domande o problemi, consulta la documentazione o modifica direttamente i file del progetto.

## 📄 Licenza

Questo progetto è stato creato come clone educativo. Personalizza liberamente per le tue esigenze.
