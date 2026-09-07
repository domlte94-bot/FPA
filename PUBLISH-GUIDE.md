# Financial Planner — Guía para publicar en Google Play

Todo lo que necesitas para pasar de PWA a app en la tienda. Empieza por la política de privacidad (ya está lista) y sigue con la ficha y el empaquetado.

---

## 0) Política de privacidad (ya lista)

El archivo `privacy.html` va en tu repo FPA, junto a `index.html`. Cuando lo subas, tu URL de política será:

```
https://domlte94-bot.github.io/FPA/privacy.html
```

Guarda esa URL — Google Play la pide obligatoriamente. Antes de publicar, revisa el email de contacto dentro del archivo (ahora dice domlte94@gmail.com).

---

## 1) Ficha del Play Store (copia y pega)

### Título de la app (máx. 30 caracteres)
```
Financial Planner: Budget
```
(Alternativas: `Money Goals — Budget & Save`, `Budget & Savings Planner`)

### Descripción corta (máx. 80 caracteres)
```
Plan your budget, track spending, and save for your goals — simple and private.
```

### Descripción larga (máx. 4000 caracteres)
```
Financial Planner is a simple, private money app that helps you take control of your budget, track your spending, and actually reach your savings goals.

No bank connection. No ads. No selling your data. You enter what you want, and everything stays yours.

WHAT YOU CAN DO
• Build a budget plan — set your monthly categories (rent, food, transport…) and see how much is left to save.
• Track your spending — log expenses on a simple calendar and see real vs planned by category.
• Set savings goals — create goals like a car, an emergency fund, or a trip, and watch your progress.
• Add savings in one tap — deposit toward any goal right from the home screen.
• See where your money goes — clear home screen with what you've spent and what you've saved.
• Protect your data — optional PIN and Face ID / fingerprint lock.
• Works offline and syncs — sign in to back up your data and restore it on a new phone.

WHO IT'S FOR
Students, freelancers, and anyone who wants a clean, no-nonsense way to plan their money without spreadsheets or complicated apps.

PRIVACY FIRST
We don't run ads, we don't track you, and we never sell your information. Your PIN is stored only on your device. See our privacy policy for details.

Start planning today and make your money go further.
```

### Otros campos de la ficha
- **Categoría:** Finance
- **Tipo:** App (gratis)
- **Etiquetas / keywords sugeridas:** budget, budgeting, savings, money, expenses, finance, goals, saving money, expense tracker, personal finance
- **Email de contacto:** domlte94@gmail.com
- **Política de privacidad:** https://domlte94-bot.github.io/FPA/privacy.html
- **Gráficos que necesitarás:**
  - Ícono 512×512 (ya lo tienes: `icon-512.png`)
  - Gráfico destacado (feature graphic) 1024×500
  - Mínimo 2 capturas de pantalla del teléfono (recomiendo 3–5: Home, Goals, Budget Plan)

> Consejo ASO: repite palabras clave naturales ("budget", "savings", "expenses") en la descripción larga sin sonar forzado. Ayuda a que te encuentren.

---

## 2) Empaquetar la PWA para Android (PWABuilder)

1. Entra a **https://www.pwabuilder.com** y pega la URL de tu app:
   `https://domlte94-bot.github.io/FPA/`
2. PWABuilder analiza tu `manifest.json` y `sw.js`. Corrige lo que marque en rojo (tu manifest ya está bastante completo).
3. Clic en **Package for stores → Android → Google Play**. Descarga el paquete: incluye el **.aab** (lo que subes a Play), el **assetlinks.json** y tu **clave de firma** (guárdala muy bien; sin ella no podrás actualizar la app).

### ⚠️ Digital Asset Links (paso que la gente olvida)
Para que la app abra sin la barra del navegador, Android verifica que tú eres dueño del sitio. Debes subir el `assetlinks.json` a la **raíz del dominio**, en:
```
https://domlte94-bot.github.io/.well-known/assetlinks.json
```
Como tu app vive en `/FPA/`, ese `.well-known` va en el repo raíz de tus GitHub Pages (el repo llamado `domlte94-bot.github.io`). Si no tienes ese repo, créalo y pon ahí la carpeta `.well-known/assetlinks.json`.

> **Recomendación fuerte:** conseguir un **dominio propio** (ej. `tusitio.com`) hace esto mucho más simple y se ve más profesional. Es opcional para empezar, pero vale la pena antes de crecer.

---

## 3) Cuenta y publicación en Google Play

1. Crea tu cuenta en **Google Play Console** — pago único de **$25 USD**.
2. Crea la app, sube el **.aab**, completa la ficha (usa los textos de arriba) y pega la **URL de la política de privacidad**.
3. Llena el formulario **"Seguridad de los datos" (Data safety)**. Declara honestamente:
   - Recopilas: **email** (para cuenta/sync) y **información financiera que el usuario ingresa**.
   - **No** compartes datos con terceros para publicidad.
   - Los datos van **cifrados en tránsito (HTTPS)**.
   - El usuario **puede pedir eliminación** de sus datos.
4. Completa la **clasificación de contenido** (content rating) — es un cuestionario corto.

### ⚠️ Regla de 12 testers (cuentas personales nuevas, 2026)
Google ahora exige que hagas una **prueba cerrada con 12 testers durante 14 días** antes de poder publicar en producción. Si no tienes 12 personas:
- Busca **comunidades de intercambio de testers** (por ejemplo, subreddits como r/androiddev, grupos de Telegram/Discord de "Google Play testers", o el sitio de intercambio de testers). La idea: tú pruebas la app de otros y ellos la tuya.
- Cuentas de correo distintas también cuentan como testers si son personas reales que instalan y abren la app.

---

## 4) Apple App Store (para después, opcional)

- Cuenta **Apple Developer: $99/año**, y necesitas una **Mac con Xcode**.
- PWABuilder también genera un proyecto para iOS, pero Apple es más estricto: cuida que la app se sienta como app (tu bloqueo con PIN, offline, íconos) para evitar el rechazo por "solo una web envuelta".
- Sugerencia: empieza solo con Google Play. Si la app agarra tracción, vas a Apple.

---

## Checklist rápido

- [ ] Subir `app.js`, `index.html` y `privacy.html` al repo FPA
- [ ] Confirmar que `.../FPA/privacy.html` abre bien
- [ ] Probar la app en tu teléfono (agregar a inicio, login, PIN, agregar ahorro)
- [ ] Generar el paquete Android en PWABuilder
- [ ] Subir `assetlinks.json` a la raíz del dominio
- [ ] Crear cuenta Google Play ($25)
- [ ] Subir .aab + ficha + política de privacidad + data safety
- [ ] Prueba cerrada con 12 testers (14 días)
- [ ] Publicar 🎉
