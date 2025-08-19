import { useEffect, useMemo, useState } from 'react'
import './App.css'

const WA_LINK = 'https://wa.me/5215592256099?text=Hola%2C%20hola'

function UseCasesSlider() {
  const items = useMemo(
    () => [
      { icon: '/icons/book-open.svg', title: 'Resúmenes', desc: 'De textos largos a puntos clave.' },
      { icon: '/icons/calendar-days.svg', title: 'Recordatorios', desc: 'Fechas y pendientes sin olvidar.' },
      { icon: '/icons/feather.svg', title: 'Redacción', desc: 'Mensajes y emails con buen tono.' },
      { icon: '/icons/gem-sparkle.svg', title: 'Ideas', desc: 'Brainstorming para proyectos y contenidos.' },
      { icon: '/icons/globe-pointer.svg', title: 'Búsqueda', desc: 'Encuentra info y entiéndela fácil.' },
      { icon: '/icons/check.svg', title: 'Tareas', desc: 'Listas y siguientes acciones.' },
    ],
    [],
  )

  const loop = [...items, ...items]

  return (
    <div className="carousel" role="region" aria-label="Casos de uso">
      <div className="carousel-track">
        {loop.map((it, i) => (
          <div className="slide" key={i} aria-label={`${it.title}: ${it.desc}`}>
            <img className="icon-img" src={it.icon} alt="" aria-hidden />
            <div className="slide-copy">
              <div className="slide-title">{it.title}</div>
              <div className="slide-desc">{it.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChatPreview({ variant = 'card', mode = 'animated' }: { variant?: 'card' | 'inline'; mode?: 'animated' | 'static' }) {
  type Msg = { side: 'left' | 'right'; text: string; green?: boolean }
  type Step =
    | { type: 'typing'; side: 'left' | 'right' }
    | ({ type: 'message' } & Msg)

  const messages: Msg[] = useMemo(
    () => [
      { side: 'left', text: 'Hola, soy HeyLuni 👋 ¿En qué te ayudo hoy?' },
      { side: 'right', text: 'Hazme un resumen de este texto largo.', green: true },
      { side: 'left', text: 'Claro. Aquí van los puntos clave en 5 bullets…' },
      { side: 'right', text: 'Recuérdame mañana a las 9am enviarlo.', green: true },
      { side: 'left', text: 'Listo. Te escribo mañana a las 9:00 ✅' },
    ],
    [],
  )

  const steps: Step[] = useMemo(() => {
    const s: Step[] = []
    messages.forEach((m) => {
      // muestra typing antes de cada mensaje
      s.push({ type: 'typing', side: m.side })
      s.push({ type: 'message', ...m })
    })
    return s
  }, [messages])

  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (mode === 'static') return
    let cancelled = false
    const run = () => {
      const step = steps[stepIndex]
      const isTyping = step?.type === 'typing'
      const delay = isTyping ? 900 : 1400
      const t = setTimeout(() => {
        if (cancelled) return
        const next = stepIndex + 1
        if (next < steps.length) {
          setStepIndex(next)
        } else {
          // pausa y reinicia
          setTimeout(() => !cancelled && setStepIndex(0), 1600)
        }
      }, delay)
      return () => clearTimeout(t)
    }
    const cleanup = run()
    return () => {
      cancelled = true
      cleanup && cleanup()
    }
  }, [stepIndex, steps, mode])

  // Render: muestra todos los mensajes ya revelados; si el paso actual es typing, muéstralo al final
  const revealed: Msg[] = []
  if (mode === 'static') {
    // en modo estático mostramos todos los mensajes sin indicador de escritura
    messages.forEach((m) => revealed.push(m))
  } else {
    for (let i = 0; i <= stepIndex && i < steps.length; i++) {
      const st = steps[i]
      if (st.type === 'message') revealed.push(st)
    }
  }
  const showTyping = mode === 'animated' && steps[stepIndex]?.type === 'typing' ? steps[stepIndex].side : null

  const wrapperClass = variant === 'card' ? 'chat-card' : 'chat-inline'
  return (
    <div className={wrapperClass} aria-label="Vista previa de chat">
      {revealed.map((m, idx) => (
        <div key={idx} className={`chat-row ${m.side}`}>
          <div className={`bubble ${m.green ? 'green' : ''}`}>{m.text}</div>
        </div>
      ))}
      {showTyping && (
        <div className={`chat-row ${showTyping}`}>
          <div className="bubble typing" aria-live="polite" aria-label="Escribiendo">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <div className="page">
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">
            <img className="logo-img" src="/images/logo.png" alt="HeyLuni" />
            <span className="brand-text">HeyLuni</span>
          </div>
          <nav className="nav-links">
            <a href="#how">Cómo funciona</a>
            <a href="#usecases">Casos</a>
            <a href="#pricing">Precio</a>
            <a href="#faqs">FAQs</a>
          </nav>
          <a className="btn btn-primary" href={WA_LINK} target="_blank" rel="noopener noreferrer">
            Habla con HeyLuni
          </a>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">WhatsApp + IA</span>
              <div className="hero-mobile-bubbles">
                <ChatPreview variant="inline" mode="static" />
              </div>
              <h1>Tu asistente personal, directo en WhatsApp</h1>
              <p className="subtitle">Ideas, recordatorios, resúmenes y redacción. Respuestas claras en segundos, 24/7.</p>
              <div className="badges"><span className="badge badge-free">100% gratis</span></div>
              <div className="cta-group">
                <a className="btn btn-primary btn-lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">Hablar ahora en WhatsApp</a>
                <a className="btn btn-outline btn-lg" href="#how">Ver cómo funciona</a>
              </div>
              <div className="perks">
                <div className="perk">
                  <img className="icon-img sm" src="/icons/bolt-lightning.svg" alt="Rápido" />
                  <span>Rápido</span>
                </div>
                <div className="perk">
                  <img className="icon-img sm" src="/icons/calendar-days.svg" alt="Recordatorios" />
                  <span>Recordatorios simples</span>
                </div>
                <div className="perk">
                  <img className="icon-img sm" src="/icons/eye-open.svg" alt="Claro" />
                  <span>Mensajes claros</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <ChatPreview />
            </div>
            
            <div className="hero-mobile-luni">
              <img className="luni-illo" src="/images/sentado.png" alt="Luni" />
            </div>
          </div>
        </section>

        <section id="how" className="section how-it-works alt decorated">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Empezar es fácil</span>
              <h2 className="section-title">¿Cómo funciona?</h2>
              <p className="lead">En tres pasos simples empiezas a usar HeyLuni.</p>
            </div>
            <div className="split-grid">
              <div className="steps timeline">
                <div className="step">
                  <img className="icon-img" src="/icons/headset.svg" alt="Contacto" />
                  <h3>Escríbele por WhatsApp</h3>
                  <p>Toca el botón y abre el chat con HeyLuni.</p>
                  <div className="example-chat right">
                    <div className="bubble green sm">Hola HeyLuni 👋</div>
                  </div>
                </div>
                <div className="step">
                  <img className="icon-img" src="/icons/circle-compose-2.svg" alt="Pide" />
                  <h3>Pide lo que quieras</h3>
                  <p>Ideas, resúmenes, recordatorios, redacción, listas y más.</p>
                  <div className="example-chat right">
                    <div className="bubble green sm">Redáctame un mensaje de bienvenida</div>
                  </div>
                </div>
                <div className="step">
                  <img className="icon-img" src="/icons/bolt-lightning.svg" alt="Rápido" />
                  <h3>Recibe respuesta en segundos</h3>
                  <p>Mensajes claros para que avances sin fricción.</p>
                  <div className="example-chat left">
                    <div className="bubble sm">Listo, aquí tienes un texto breve y claro ✨</div>
                  </div>
                </div>
              </div>
              <aside className="side-card">
                <div className="side-card-inner">
                  <img className="icon-img" src="/icons/circle-compose-2.svg" alt="Consejos" />
                  <h3>Consejos para empezar</h3>
                  <p>Pequeños trucos para mejores respuestas.</p>
                  <ul className="checklist">
                    <li><img src="/icons/check.svg" aria-hidden className="check"/> Sé específico con lo que necesitas</li>
                    <li><img src="/icons/check.svg" aria-hidden className="check"/> Indica formato: lista, puntos o tono</li>
                    <li><img src="/icons/check.svg" aria-hidden className="check"/> Da contexto si es relevante</li>
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="usecases" className="features">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Por qué HeyLuni</span>
              <h2 className="section-title">Hecho para moverte más rápido</h2>
            </div>
            <div className="grid">
              <div className="feature">
                <img className="icon-img" src="/icons/gauge-3.svg" alt="Velocidad" />
                <h3>Respuestas en segundos</h3>
                <p>Para no perder el hilo</p>
              </div>
              <div className="feature">
                <img className="icon-img" src="/icons/alarm-clock.svg" alt="Disponibilidad" />
                <h3>Disponibilidad</h3>
                <p>Disponible 24/7</p>
                <p>Siempre a un mensaje</p>
              </div>
              <div className="feature">
                <img className="icon-img" src="/icons/handshake.svg" alt="Sencillo" />
                <h3>Sencillo</h3>
                <p>Sin apps nuevas</p>
                <p>Solo WhatsApp</p>
              </div>
            </div>
          </div>
        </section>

        

        <section className="section usecases alt decorated">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Ideas al instante</span>
              <h2 className="section-title">Casos de uso</h2>
            </div>
            <UseCasesSlider />
          </div>
        </section>

        <section id="privacy" className="section privacy">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Tu información importa</span>
              <h2 className="section-title">Privacidad y tranquilidad</h2>
            </div>
            <div className="icon-list">
              <div className="icon-item">
                <img className="icon-img" src="/icons/fingerprint.svg" alt="Datos" />
                <div>
                  <h4>Tus datos, tuyos</h4>
                  <p>Usamos tus mensajes solo para responderte mejor.</p>
                </div>
              </div>
              <div className="icon-item">
                <img className="icon-img" src="/icons/cryptography.svg" alt="Seguridad" />
                <div>
                  <h4>Seguridad</h4>
                  <p>Buenas prácticas y cifrado en tránsito.</p>
                </div>
              </div>
              <div className="icon-item">
                <img className="icon-img" src="/icons/eye-closed.svg" alt="No spam" />
                <div>
                  <h4>Sin spam</h4>
                  <p>Solo mensajes cuando tú lo pidas o programes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="section pricing alt decorated">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Beta</span>
              <h2 className="section-title">Precio</h2>
            </div>
            <div className="pricing-grid">
              <div className="plans">
                <div className="plan card">
                  <div className="plan-badge">Beta</div>
                  <h3>Acceso anticipado</h3>
                  <p className="plan-price">Gratis</p>
                  <ul className="plan-list">
                    <li>• Respuestas rápidas ilimitadas</li>
                    <li>• Recordatorios básicos</li>
                    <li>• Soporte por chat</li>
                  </ul>
                  <a className="btn btn-primary btn-lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">
                    Probar ahora en WhatsApp
                  </a>
                </div>
              </div>
              <aside className="pricing-side">
                <h3>Construyamos HeyLuni juntos</h3>
                <p className="lead">Tu feedback guía el producto. ¿Qué te gustaría que haga?</p>
                <img className="pricing-illo" src="/images/aconsejando.png" alt="Luni aconsejando" />
              </aside>
            </div>
          </div>
        </section>

        

        <section id="faqs" className="section faqs alt">
          <div className="container">
            <div className="section-header">
              <span className="section-eyebrow">Antes de empezar</span>
              <h2 className="section-title">Preguntas frecuentes</h2>
            </div>
            <div className="faq-list">
              <details className="faq">
                <summary>
                  <img className="faq-icon" src="/icons/circle-info.svg" alt="" aria-hidden />
                  <span className="faq-title">¿Necesito instalar algo?</span>
                </summary>
                <div className="faq-content">
                  <div>
                    <p>No. HeyLuni funciona directamente en tu WhatsApp.</p>
                  </div>
                </div>
              </details>
              <details className="faq">
                <summary>
                  <img className="faq-icon" src="/icons/circle-info.svg" alt="" aria-hidden />
                  <span className="faq-title">¿Tiene costo?</span>
                </summary>
                <div className="faq-content">
                  <div>
                    <p>Durante la beta, usar HeyLuni es gratis.</p>
                  </div>
                </div>
              </details>
              <details className="faq">
                <summary>
                  <img className="faq-icon" src="/icons/circle-info.svg" alt="" aria-hidden />
                  <span className="faq-title">¿Puedo programar recordatorios?</span>
                </summary>
                <div className="faq-content">
                  <div>
                    <p>Sí. Indica el día y la hora y HeyLuni te escribe.</p>
                  </div>
                </div>
              </details>
            </div>
          </div>
        </section>

        
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-surface">
            <div className="footer-top">
              <div className="footer-col brand-col">
                <div className="footer-brand">
              <img className="logo-img" src="/images/logo.png" alt="HeyLuni" />
              <span className="brand-text">HeyLuni</span>
            </div>
                <p className="footer-tagline">Tu asistente personal con IA en WhatsApp.</p>
                <p className="footer-desc">Ideas, recordatorios y redacción al instante. 100% gratis en beta.</p>
              </div>
              <div className="footer-col links-col">
                <div className="footer-group">
                  <div className="footer-heading">Producto</div>
                  <ul className="footer-list">
                    <li><a href="#how">Cómo funciona</a></li>
                    <li><a href="#usecases">Casos de uso</a></li>
                    <li><a href="#pricing">Precio</a></li>
                    <li><a href="#faqs">FAQs</a></li>
                  </ul>
                </div>
                <div className="footer-group">
                  <div className="footer-heading">Recursos</div>
                  <ul className="footer-list">
                    <li><a href="#privacy">Privacidad</a></li>
                    <li><a href={WA_LINK} target="_blank" rel="noopener noreferrer">Soporte por WhatsApp</a></li>
                  </ul>
                </div>
              </div>
              <div className="footer-col cta-col">
                <a className="btn btn-primary btn-lg" href={WA_LINK} target="_blank" rel="noopener noreferrer">Hablar en WhatsApp</a>
                <div className="support-line">
                  <img className="support-icon" src="/icons/headset.svg" alt="" aria-hidden />
                  <span>Soporte 24/7 en WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
