# endemicacrea.cl

Vitrina de marca de **Endémica Crea** (Ángel Guajardo, mimbre chileno), con puerta de
entrada a contacto comercial y terreno preparado para un futuro e-commerce.

Sitio estático (HTML/CSS/JS), sin build step. Contenido multilenguaje (ES/EN/FR)
vive en `content/*.json` — no está hardcodeado en el HTML — para que sea fácil de
editar por idioma.

## Estructura

```
index.html              estructura de las 11 secciones del brief
assets/css/style.css    identidad visual (paleta, tipografía, layout)
assets/js/i18n.js       carga content/<lang>.json y puebla el DOM
assets/js/main.js       formulario de contacto, botones de compartir
content/es.json         copy en español (idioma base)
content/en.json         traducción al inglés
content/fr.json         traducción al francés
```

Para editar textos: modificar el `.json` del idioma correspondiente, no el HTML.

## Cómo previsualizar

Al ser un sitio estático que hace `fetch()` de los `.json`, se necesita un
servidor local (no funciona abriendo el `index.html` directo por `file://`):

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000`.

## Formulario de contacto

Usa el endpoint real de [Formspree](https://formspree.io/f/xqpkvkbl) apuntando
a `hola@endemicacrea.cl`. El envío es vía AJAX (`fetch` con
`Accept: application/json`) implementado a mano en `assets/js/main.js` —no se
usa la librería `@formspree/ajax`— para poder mostrar los mensajes de
éxito/error en el idioma activo (`contacto.formSuccess` / `contacto.formError`
en cada `content/<lang>.json`).

## Pendientes explícitos (marcados también en el código con comentarios)

- [ ] **Fotos y videos reales**: hoy son placeholders (bloques a rayas). Se
      cargan desde la carpeta de Google Drive compartida y reemplazan los
      `<div class="placeholder-media">` en `index.html`.
- [ ] **Meta Pixel ID real**: reemplazar `PIXEL_ID_AQUI` en el `<head>` de
      `index.html`. Solo trackea `PageView` (sin evento de conversión de pago).
- [ ] **Instagram embeds**: reemplazar los 3 placeholders de la sección
      "Instagram en vivo" por embeds oficiales de posts (Instagram → post →
      Insertar). Meta no permite un feed 100% auto-actualizable sin token de
      la Graph API, así que esta es la alternativa sin mantenimiento de backend.
- [ ] **Revisión humana de traducciones**: EN por Sebastián (formación como
      traductor inglés-español, revisión más rigurosa) y FR con apoyo externo
      recomendado.
- [ ] **Catálogo futuro / e-commerce** (fase futura, no implementada): definir
      qué piezas entran al catálogo de venta y elegir plataforma — Shopify
      (más rápido, externo) vs. desarrollo a medida (más control, más
      mantenimiento propio). El botón "Consultar disponibilidad" queda como
      antesala de esto.

## Qué se eliminó respecto a la iteración anterior

Todo lo relacionado a la bienal Révélations 2027, el viaje a París, el
crowdfunding y el mecenazgo — tanto en copy como en secciones dedicadas —
fue removido por completo. Se mantiene intacta la biografía de Ángel
Guajardo, la historia de su padre Guillermo Guajardo, el oficio del mimbre,
los colaboradores (Segundo Rodríguez, Pablo García) y los proyectos FONDART
como hitos de trayectoria (sin mención a viajes o destinos).
