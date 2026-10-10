/* ============================================
   FORMULARIO DE CONTACTO - LEGAL CONSULTORES S.A.S
   Envío con Formspree
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Cambia esto por tu ID de Formspree
    // Ej: https://formspree.io/f/xabcdefg
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/TU_ID_AQUI';

    // Elementos
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitBtnOriginalHTML = submitBtn.innerHTML;
    const formNote = form.querySelector('.form-note');

    // Función para mostrar mensajes al usuario
    function showMessage(type, text) {
        // Eliminar mensaje anterior si existe
        const existingMsg = form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `form-message form-message--${type}`;
        msg.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${text}</span>
        `;

        form.insertBefore(msg, formNote);

        // Auto-eliminar después de 8 segundos
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(-10px)';
            setTimeout(() => msg.remove(), 300);
        }, 8000);
    }

    // Función para cambiar estado del botón
    function setLoading(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i> Enviando...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtnOriginalHTML;
        }
    }

    // Manejo del envío
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validación HTML5 nativa
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Recopilar datos
        const formData = new FormData(form);

        // Añadir metadata útil
        formData.append('_subject', 'Nueva consulta desde el sitio web - LGV Legal Consultores');
        formData.append('_replyto', formData.get('email'));
        formData.append('Página', window.location.href);
        formData.append('Fecha', new Date().toLocaleString('es-CO'));

        setLoading(true);

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage(
                    'success',
                    '¡Gracias por contactarnos! Hemos recibido tu mensaje y te responderemos lo antes posible.'
                );
                form.reset();
            } else {
                const data = await response.json().catch(() => ({}));
                const errorMsg = data.errors
                    ? data.errors.map(err => err.message).join(', ')
                    : 'Hubo un problema al enviar el mensaje. Intenta de nuevo.';
                showMessage('error', errorMsg);
            }
        } catch (error) {
            console.error('Error al enviar formulario:', error);
            showMessage(
                'error',
                'No pudimos enviar tu mensaje. Verifica tu conexión o escríbenos por WhatsApp al 314 869 5606.'
            );
        } finally {
            setLoading(false);
        }
    });

    // Limpiar mensajes cuando el usuario empieza a escribir de nuevo
    form.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('input', () => {
            const msg = form.querySelector('.form-message');
            if (msg) msg.remove();
        });
    });
});