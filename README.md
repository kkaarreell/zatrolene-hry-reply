# Zatrolené Hry - Odpovědět na příspěvek

Greasemonkey/Tampermonkey userscript pro Zatrolené-hry.cz, který přidává možnost odpovědět na konkrétní příspěvek v diskuzi s citací.

## Funkce

- Přidává tlačítko **"Odpovědět"** do dropdown menu "Akce" u každého příspěvku v diskuzi
- Po kliknutí na "Odpovědět":
  - Automaticky otevře formulář pro přidání nového příspěvku
  - Předvyplní textové pole s citací příspěvku, na který odpovídáte
  - Citace obsahuje:
    - Symbol ↪ a zmínku autora (`@username`)
    - Zkrácený text příspěvku (max 2 řádky)
    - Formát: `↪ @username : »text příspěvku…«`

### Podpora výběru textu

- **Bez výběru textu**: Automaticky cituje začátek příspěvku (první 2 řádky)
- **S výběrem textu**:
  - Označte myší konkrétní část příspěvku, kterou chcete citovat
  - Klikněte na "Odpovědět"
  - Bude citována pouze označená část textu (případně zkrácená na 2 řádky)
  - Ideální pro dlouhé příspěvky, kdy chcete reagovat jen na konkrétní část

## Instalace

1. **Nainstalujte Tampermonkey nebo Greasemonkey**
   - Chrome/Edge: [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - Firefox: [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) nebo [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)
   - Safari: [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)

2. **Nainstalujte skript**
   - Otevřete soubor `zatrolene-hry-reply.user.js` v textovém editoru
   - Zkopírujte celý obsah
   - Klikněte na ikonu Tampermonkey v prohlížeči
   - Zvolte "Create a new script" (Vytvořit nový skript)
   - Vymažte výchozí obsah a vložte zkopírovaný kód
   - Uložte (Ctrl+S nebo File → Save)

3. **Alternativně**: Pokud máte soubor na disku
   - V Tampermonkey zvolte "Utilities" (Nástroje)
   - V sekci "Import from file" nahrajte soubor `zatrolene-hry-reply.user.js`

## Použití

### Základní použití
1. Otevřete libovolnou diskuzi na www.zatrolene-hry.cz
2. U každého příspěvku najdete dropdown menu "Akce"
3. Klikněte na "Akce" a vyberte nově přidanou možnost **"Odpovědět"**
4. Otevře se formulář s předvyplněnou citací
5. Napište svou odpověď pod citaci a odešlete

### Použití s výběrem textu
1. Otevřete libovolnou diskuzi na www.zatrolene-hry.cz
2. Myší označte konkrétní část příspěvku, na kterou chcete reagovat
3. S aktivním výběrem klikněte na "Akce" → **"Odpovědět"**
4. Otevře se formulář s citací pouze označené části
5. Napište svou odpověď a odešlete

## Příklad výstupu

```
↪ @Alvad : »@Zeus Dost bych ocenil a troufám si tvrdit, že nejenom já, kdyby se v diskuzích dalo odpovídat konkrétnímu člověku na konkretni…«

Zde napíšete svou odpověď...
```

## Technické poznámky

- Skript automaticky detekuje CKEditor 5, který Zatrolené hry používají pro formátování textu
- Podporuje dynamicky načítaný obsah
- Zkracuje dlouhé příspěvky na max. 150 znaků (~2 řádky)
- Odstraňuje vnořené citace, aby nedocházelo k duplicitám

## Kompatibilita

- Testováno na: Zatrolené-hry.cz diskuze
- Vyžaduje: Greasemonkey nebo Tampermonkey
- Kompatibilní s: Chrome, Firefox, Edge, Safari

## Licence

Volné použití pro osobní potřeby.
