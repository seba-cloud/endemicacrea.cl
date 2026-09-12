/* ============================================================
   main.js — botones de compartir y envío del formulario de contacto
   ============================================================ */

(function () {
  function currentLang() {
    return document.documentElement.lang || 'es';
  }

  function currentContent() {
    return (window.EndemicaI18n && window.EndemicaI18n.getCurrentContent(currentLang())) || {};
  }

  function initShareButtons() {
    var whatsappLink = document.getElementById('share-whatsapp');
    var copyBtn = document.getElementById('share-copy');

    if (whatsappLink) {
      whatsappLink.addEventListener('click', function (e) {
        e.preventDefault();
        var url = encodeURIComponent(window.location.href);
        whatsappLink.href = 'https://wa.me/?text=' + url;
        window.open(whatsappLink.href, '_blank', 'noopener');
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var originalText = copyBtn.textContent;
        navigator.clipboard.writeText(window.location.href).then(function () {
          var content = currentContent();
          copyBtn.textContent = (content.compartir && content.compartir.copied) || 'Copiado';
          setTimeout(function () { copyBtn.textContent = originalText; }, 2000);
        }).catch(function () {
          console.error('No se pudo copiar el link');
        });
      });
    }
  }

  function initContactForm() {
    var form = document.getElementById('contact-form');
    var feedback = document.getElementById('form-feedback');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var content = currentContent();
      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            feedback.textContent = (content.contacto && content.contacto.formSuccess) || 'Gracias, tu mensaje fue enviado.';
            feedback.hidden = false;
            form.reset();
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          feedback.textContent = (content.contacto && content.contacto.formError) || 'Hubo un problema al enviar tu mensaje.';
          feedback.hidden = false;
        });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initShareButtons();
    initContactForm();
  });
})();
