# Vishop REST API (dev123)

Dokumentacja wygenerowana na podstawie kodu projektu oraz live requestów do `https://dev123.vishop.pl`


## Bazowy URL
`https://dev123.vishop.pl`

## Uwagi ogólne
- Format danych: JSON
- Uwierzytelnianie: brak (publiczne odczyty + wybrane POST-y)
- Daty: ISO 8601 (UTC, sufiks `Z`)
- `shop_id` w tym projekcie: `1`

## Endpoints

### 1) Sklep
`GET /panel/shops/{shop_id}/`

Przykład odpowiedzi:
```json
{"id":1,"name":"Przykładowy sklep","owner":1,"game":"minecraft","theme":"light","logo":"https://i.pinimg.com/originals/4a/3c/4b/4a3c4b4e9c56b3a00f573b75138cf79d.png","navigation":[{"id":564,"shop":1,"type":"subpage","name":"Regulamin","url":null,"subpage":495,"subpage_name":"Regulamin"}],"style":"","primary_color":"#AA00FF","home_link":true,"online":true,"latest_payments":true,"richest_player":true,"full_color":false,"rules":"","ml_widget":"fajnemc.pl","sd_widget":"2","premium_until":"4762-09-06T21:51:45.038141Z","premium":true,"announcements":[],"monthly_goal_public":0,"domain":"asd.ivall.pl","richest_player_since":null}
```

### 2) Serwery
`GET /panel/shops/{shop_id}/servers/`

Przykład odpowiedzi:
```json
[{"id":1,"name":"Survival","shop":1,"ip":"mc.ivall.pl","image":"https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/72/Block_of_Gold_JE6_BE3.png"},{"id":1380,"name":"BoxPvP","shop":1,"ip":"boxpvp.pl","image":"https://static.wikia.nocookie.net/minecraft_gamepedia/images/8/8e/Iron_Sword_JE2_BE2.png"},{"id":1381,"name":"WaterBlock","shop":1,"ip":"waterblock.pl","image":"https://static.wikia.nocookie.net/minecraft_gamepedia/images/6/64/Water_Bucket_JE1_BE1.png"}]
```

### 3) Produkty dla serwera
`GET /panel/shops/{shop_id}/products/?server={server_id}`

Przykład odpowiedzi (skrót):
```json
[{"id":13645,"prices":{"id":13649,"icehost":"5.00","ivhost":"2.00","skillhost":"10.00","paypal":"5.00","hotpay_transfer":"5.00","hotpay_paysafecard":null,"cashbill_transfer":"123.00","cashbill_paysafecard":null,"cashbill_paypal":null,"paybylink_transfer":"5.00","paybylink_paysafecard":"1.00","simpay_directbilling":"15.00","simpay":"15.00","dpay":null,"stripe":"12.00","hotpay_sms":null,"paybylink_sms":null},"promo":"15","name":"VIP","description":"<p>Najtańsza <strong>dostępna</strong> ranga na serwerze.</p><p></p><p>Przywileje rangi:</p><ul><li><p>prefix <span style=\"color: #673ab7\">VIP</span></p></li><li><p>kit <strong><em>VIP</em></strong></p></li></ul>","short_description":"","image":"https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/7e/Block_of_Iron_JE4_BE3.png","main_price":"5.00","require_player_online":false,"slider":false,"slider_min":2,"slider_max":55,"slider_name":"Ilość","order":1,"server":1}]
```

### 4) Produkt (szczegóły)
`GET /panel/shops/{shop_id}/products/{product_id}/`

Przykład odpowiedzi:
```json
{"id":13645,"prices":{"id":13649,"icehost":"5.00","ivhost":"2.00","skillhost":"10.00","paypal":"5.00","hotpay_transfer":"5.00","hotpay_paysafecard":null,"cashbill_transfer":"123.00","cashbill_paysafecard":null,"cashbill_paypal":null,"paybylink_transfer":"5.00","paybylink_paysafecard":"1.00","simpay_directbilling":"15.00","simpay":"15.00","dpay":null,"stripe":"12.00","hotpay_sms":null,"paybylink_sms":null},"promo":"15","name":"VIP","description":"<p>Najtańsza <strong>dostępna</strong> ranga na serwerze.</p><p></p><p>Przywileje rangi:</p><ul><li><p>prefix <span style=\"color: #673ab7\">VIP</span></p></li><li><p>kit <strong><em>VIP</em></strong></p></li></ul>","short_description":"","image":"https://static.wikia.nocookie.net/minecraft_gamepedia/images/7/7e/Block_of_Iron_JE4_BE3.png","main_price":"5.00","require_player_online":false,"slider":false,"slider_min":2,"slider_max":55,"slider_name":"Ilość","order":1,"server":1}
```

### 5) Dostawcy płatności
`GET /panel/shops/{shop_id}/payments/`

Przykład odpowiedzi (fragment):
```json
[{"id":5,"sms_numbers":[{"id":2,"number":123,"price":1.23,"sms_content":"a"},{"id":4,"number":123,"price":16.45,"sms_content":"123"}],"is_sms":true,"name":"sms","provider":"hotpay_sms","sms_content":""},{"id":23,"sms_numbers":[],"is_sms":false,"name":"przelew","provider":"hotpay_transfer","sms_content":""}]
```

### 6) Ostatnie zakupy
`GET /panel/shops/{shop_id}/latest_payments/`

Przykład odpowiedzi:
```json
[{"player":"test","status":"executed","product_name":"VIP","quantity":1,"server":1,"created_at":"2026-01-28T10:26:56.883807Z"},{"player":"ivall","status":"executed","product_name":"VIP","quantity":1,"server":1,"created_at":"2026-01-17T13:50:04.457655Z"}]
```

### 7) Ogłoszenia
`GET /panel/shops/{shop_id}/announcements/`

Przykład odpowiedzi:
```json
[]
```

### 8) Najbogatszy gracz
`GET /panel/shops/{shop_id}/richest_player/`

Przykład odpowiedzi:
```json
{"player":"test","spend":234.86}
```

### 9) Podstrona CMS
`GET /panel/shops/{shop_id}/subpages/{subpage_id}/`

Przykład odpowiedzi:
```json
{"id":495,"name":"Regulamin","content":"<h1>Regulamin serwera</h1><ul><li><p>Przestrzegaj netykiety</p></li></ul>","shop":1}
```

### 10) Status płatności
`GET /panel/shops/{shop_id}/payment-status/{payment_id}/`

Przykład odpowiedzi (nieistniejące ID):
```json
{"detail":"Not found."}
```

### 11) Kod rabatowy
`POST /panel/shops/{shop_id}/codes/use/`

Body:
```json
{"code":"KOD","product":13645}
```

Przykład błędu:
```json
{"detail":"No PromoCode matches the given query."}
```

### 12) Voucher
`POST /panel/shops/{shop_id}/vouchers/use/`

Body:
```json
{"player":"NickGracza","code":"KOD"}
```

Przykład błędu:
```json
{"detail":"No Voucher matches the given query."}
```

### 13) Utworzenie płatności
`POST /panel/shops/{shop_id}/products/{product_id}/payments/`

Body (minimum):
```json
{
  "player": "NickGracza",
  "provider": "hotpay_transfer",
  "quantity": 1,
  "success_page": "https://twojadomena.pl/payment/{PAYMENT_ID}"
}
```

Przykład błędu walidacji:
```json
{"provider":["\"invalid\" is not a valid choice."]}
```