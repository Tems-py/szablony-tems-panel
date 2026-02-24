# Redesign — zmiany (luty 2026)

## Cel redesignu

Celem było stworzenie nowoczesnego, prostego i intuicyjnego interfejsu dashboardu. Zachowano pierwotny kolor primary (indigo), wszystkie funkcje i ścieżki. Nie użyto gradientów.

---

## Design system

### Kolory
- **Tło strony:** `bg-slate-50 dark:bg-slate-950` (zamiast `gray-50 / gray-900`)
- **Karty / Sidebar:** `bg-white dark:bg-slate-900`
- **Wewnętrzne sekcje:** `bg-slate-50 dark:bg-slate-800/60`
- **Obramowania:** `border-slate-200 dark:border-slate-700`
- **Tekst główny:** `text-slate-900 dark:text-white`
- **Tekst poboczny:** `text-slate-500 dark:text-slate-400`
- **Primary akcja:** `bg-indigo-600 hover:bg-indigo-700 text-white`
- **Niebezpieczna akcja:** `bg-red-500 hover:bg-red-600 text-white`
- **Sukces:** `bg-emerald-...` / zielone odznaki zniżki
- **Ostrzeżenie:** `bg-amber-50...` (bannery)

### Karty
Wszystkie karty mają: `bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700`

### Animacje
- Hover na wierszach i kartach: `transition-colors duration-150`
- Spinner loading: `animate-spin` (wbudowany Tailwind)
- Potwierdzenie zapisu: zmiana wyglądu przycisku na zielony z ptaszkiem
- W `main.css` dodano `@keyframes fadeInUp` i `@keyframes fadeIn` jako klasy pomocnicze

---

## Zmienione pliki

### `src/main.css`
- Zmieniono kolory `hr` na slate (zamiast gray)
- Dodano `@keyframes fadeInUp` i `@keyframes fadeIn` — klasy `.animate-fade-in-up` i `.animate-fade-in`

### `src/components/button.tsx`
- Całkowity redesign — nowy styl `flex items-center gap-2.5 px-3 py-2 rounded-lg`
- Active state: `bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300`
- Hover state: `hover:bg-slate-100 dark:hover:bg-slate-800`
- Usunięto zbędne duplikaty klas (poprzednio miał `rounded` dwa razy, dwa `px-*`)

### `src/components/darkModeToggle.tsx`
- Drobna zmiana stylów — `slate` zamiast `gray`, icon `w-4 h-4` (zamiast `w-5 h-5`)
- Dodano `title` atrybut dla lepszej dostępności

### `src/components/discordInfo.tsx`
- Zmieniono czerwony banner na **amber** (mniej agresywny dla beta info)
- Czystszy tekst, lepszy kontrast

### `src/components/sidebar.tsx`
- **Całkowity redesign** — nowy layout `aside` z `rounded-xl border`
- Dodano **ikony SVG** (heroicons v2) przy każdym linku nawigacyjnym
- Avatar użytkownika przeniesiony na dół z `ring` efektem
- Dodano `DarkModeToggle` obok avatara
- Przycisk "Wyloguj" ma kolor czerwony z hover efektem
- Dodano etykietę "Nawigacja" (uppercase, tracking-widest)
- `isActive()` helper dla prawidłowego wyróżniania aktywnej trasy

### `src/components/shopSidebar.tsx`
- **Całkowity redesign** zgodny z `sidebar.tsx`
- Dodano **ikony SVG** dla każdej sekcji (Przegląd, Konfiguracja, Domena, Restart, Logi, Pliki)
- Naprawiono bug: poprzednio używał `location.pathname` bez `useLocation()` — zastąpiono `const {pathname} = useLocation()`
- Mobile hamburger: nowy wygląd z animowanym chevronem
- Desktop sidebar: wyświetla numer `Sklep #ID` jako label
- Wyekstrahowano `navContent()` do ponownego użycia między wersją mobilną i desktopową
- Powrót do panelu wyróżniony inaczej (szary, nie indigo)

### `src/components/payment.tsx`
- Całkowity redesign — czystszy layout bez zbędnego `w-min`
- Slider i pole numeryczne w jednym wierszu (label + input)
- Etykieta "Do zapłaty" z ceną obok zniżki
- Dodano informację o cenie (7 zł/miesiąc + 0,20 zł/dzień powyżej 30)
- Zniżka wyświetlana jako `rounded-full` badge z kolorem emerald

### `src/components/adminList.tsx`
- Całkowity redesign — lista adminów jako karty zamiast tabeli
- Avatary w okrągłych ramkach
- Przycisk "Usuń" w stylu inline (text-red zamiast bg-red)
- Przycisk "Dodaj" przeniesiony do rzędu z inputem
- Info box o kodzie zaproszenia z ikoną (indigo, nie szary span)
- Enter w polu invite code wywołuje `addAdmin()`
- Właściciel oznaczony jako `rounded-full` badge "Właściciel"

### `src/components/reinstall.tsx`
- Całkowity redesign — sekcja z ikoną warning
- Formularz z czerwonym tłem w obramowaniu
- Bardziej czytelne etykiety (uppercase tracking)
- Przycisk "Reinstaluj" jako `bg-red-500` button
- Usunięto `<input type="button">` na rzecz `<button>`

### `src/components/shopView.tsx`
- Zmieniono tło na `bg-slate-50 dark:bg-slate-950`
- Naprawiono nazewnictwo: `navigator` → `navigatorFunction` (unikanie konfliktu z `window.navigator`)
- Poprawiono spacing layoutu sidebar+main

### `src/routes/panel.tsx`
- **Całkowity redesign** — layout `xl:grid-cols-[1fr_280px]`
- Lewa kolumna: usługi, szablony kupione, szablony premium
- Prawa kolumna: kod zaproszenia + szybkie linki
- **Empty state** dla pustej listy usług (ikona + opis + CTA button)
- Wiersze usług mają ikonę sklepu, nazwę domeny, datę ważności i chevron
- Kod zaproszenia: przycisk kopiowania z potwierdzeniem (zielony ptaszek + tekst "Skopiowano!")
- Naprawiono `alert()` → inline `copied` state
- Szablony wyświetlane w siatce z hover border efektem
- Szablony premium mają badge z ceną w prawym górnym rogu

### `src/routes/shop.tsx`
- **Całkowity redesign** — hierarchiczne karty zamiast masywnej siatki
- Header z domeną, datą ważności, linkiem do sklepu
- Szybkie akcje w siatce 3 kolumn (Domena, Logi, Kopia zapasowa)
- Kopia zapasowa: spinner podczas pobierania, `disabled` podczas `downloading`
- Przedłużenie + Reinstalacja obok siebie
- Admini + Restart obok siebie
- Wszystkie elementy mają dedykowane kolorowe ikony

### `src/routes/createShop.tsx`
- **Całkowity redesign** — jeden card z formularzem `max-w-2xl`
- Etykiety pól jako uppercase tracking labels
- Dodano opisy pomocnicze pod każdym polem
- Preview szablonu obok komunikatu o zakupie
- Separator `<hr>` między sekcjami
- Checkbox regulaminu z linkiem
- Error alert z ikoną (lewy border red-500)
- Przycisk "Przejdź do płatności" ze strzałką →
- Naprawiono: `navigator` → `navigatorFunction`

### `src/routes/plugins.tsx`
- **Całkowity redesign** — card z dwoma kolumnami (preview + opis)
- Usunięto nadmiarowe zagnieżdżenia `bg-gray-*`
- Info box licencji jako `indigo` alert z ikoną
- Error brak dostępu jako `red` alert z ikoną
- Placeholdery w code block z komentarzami

### `src/routes/resources.tsx`
- **Całkowity redesign** — siatka kart `sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Każda karta: podgląd obrazka + nazwa + przycisk pobierz
- Info box licencji analogiczny do plugins.tsx
- Error brak dostępu jako `red` alert z ikoną
- Naprawiono: `navigator` → `navigatorFunction`

### `src/routes/shop/restart.tsx`
- **Całkowity redesign** — czysty card bez `bg-gray-100`
- Spinner podczas restartu (`restarting` state)
- Cooldown wyświetlany w amber info boxie zamiast inline tekstu
- Przycisk Restart z ikoną refresh

### `src/routes/shop/domain.tsx`
- **Całkowity redesign** — instrukcja krok po kroku (1, 2, 3)
- Krok 1: tabela z danymi CNAME + screenshot Cloudflare
- Krok 2: przycisk "Dodaj domenę" ze spinnerem
- Krok 3: opcjonalny TXT (tylko nie-Cloudflare) z inline tabelą po kliknięciu
- Sekcja "Zmień domenę" jako osobna karta
- Usunięto `<br/>` na rzecz proper spacing

### `src/routes/shop/config.tsx`
- **Redesign wrappera** — header z przyciskiem Zapisz
- Przycisk Zapisz: 3 stany — normalny / `saving` (spinner) / `saved` (zielony ptaszek)
- Amber warning box: "Pamiętaj o restarcie"
- Monaco Editor w `rounded-xl overflow-hidden border`
- Dodano `padding: {top: 12}` w Monaco options

### `src/routes/shop/logs.tsx`
- **Redesign wrappera** — header z przyciskiem "Odśwież"
- Info box z wskazówką o szukaniu ERROR/WARN
- Loading state podczas ładowania logów (spinner na ciemnym tle)
- Monaco: zmieniono language na `plaintext`, dodano `wordWrap: "on"`, `minimap: {enabled: false}`

### `src/routes/shop/fileSystem.tsx`
- **Redesign wrappera** — warning box zamiast czerwonego h3
- Breadcrumb ścieżki nad edytorem
- Sidebar plików: karty z nagłówkami "Foldery" / "Pliki"
- Aktywny plik wyróżniony indigo
- Przyciski Zapisz i Zastąp: nowe style, `saved` state z ptaszkiem
- Monaco: `minimap: {enabled: false}`, lepszy padding
- Podgląd obrazka: centered w pełnowymiarowej karcie

---

## Co NIE zostało zmienione

- Cała logika biznesowa i API calls — bez zmian
- Ścieżki routingu — bez zmian
- Hooki (`useDarkMode.ts`) — bez zmian
- Router (`main.tsx`) — bez zmian
- Landing page (`routes/index.tsx`) — bez zmian (poza zakresem)
- Navbar (`components/navbar.tsx`) — bez zmian (poza zakresem)
- Login / Logout / NotFound — bez zmian
- `src/config.ts` — bez zmian
- Swiper styles — bez zmian
- Anti-FOUC script w `index.html` — bez zmian
