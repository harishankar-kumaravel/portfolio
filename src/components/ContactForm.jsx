import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactForm() {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const encode = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const formspreeId = import.meta.env.VITE_FORMSPREE_ID

    try {
      let response
      if (formspreeId && formspreeId !== 'your_id') {
        // Submit using Formspree (JSON format)
        response = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(formState),
        })
      } else {
        // Submit using Netlify Forms (URL Encoded format)
        response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode({ 'form-name': 'contact', ...formState }),
        })
      }

      if (response.ok) {
        setSubmitted(true)
        setFormState({ name: '', email: '', message: '' })
      } else {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to submit form. Please try again.')
      }
    } catch (error) {
      console.error('Form submission failed:', error)
      setErrorMessage(error.message || 'Something went wrong. Please check your connection.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="liquid-glass rounded-3xl p-6 md:p-8 shadow-glow border border-teal/20 relative overflow-hidden">
      {submitted ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 space-y-4"
        >
          <div className="w-16 h-16 bg-teal/10 border border-teal/30 rounded-full flex items-center justify-center mx-auto mb-4 text-teal">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={3} 
              stroke="currentColor" 
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-foam">Message Sent!</h3>
          <p className="text-mist/80 text-sm max-w-sm mx-auto leading-6">
            Thank you for reaching out. I will review your message and get back to you shortly.
          </p>
          <button 
            type="button" 
            onClick={() => setSubmitted(false)}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-teal/25 theme-card-soft px-5 py-2 text-xs font-bold text-foam hover:border-teal/60 hover:text-teal transition-all cursor-pointer"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          name="contact" 
          method="POST" 
          data-netlify="true" 
          className="space-y-5"
        >
          {/* Netlify hidden input identifier */}
          <input type="hidden" name="form-name" value="contact" />
          
          <h3 className="text-xl font-bold text-foam mb-6">Send a Message</h3>

          {errorMessage && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="form-name" className="text-xs font-extrabold uppercase tracking-wider text-teal">Your Name</label>
            <input 
              type="text" 
              id="form-name"
              name="name"
              required
              placeholder="John Doe"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full bg-black/10 dark:bg-black/45 border border-teal/20 rounded-2xl px-4 py-3 text-foam placeholder-mist/40 focus:outline-none focus:border-teal/60 focus:ring-1 focus:ring-teal/60 transition-all text-sm backdrop-blur-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="form-email" className="text-xs font-extrabold uppercase tracking-wider text-teal">Your Email</label>
            <input 
              type="email" 
              id="form-email"
              name="email"
              required
              placeholder="john@example.com"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full bg-black/10 dark:bg-black/45 border border-teal/20 rounded-2xl px-4 py-3 text-foam placeholder-mist/40 focus:outline-none focus:border-teal/60 focus:ring-1 focus:ring-teal/60 transition-all text-sm backdrop-blur-md"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="form-message" className="text-xs font-extrabold uppercase tracking-wider text-teal">Project Brief / Message</label>
            <textarea 
              id="form-message"
              name="message"
              required
              rows={4}
              placeholder="Tell me about your project, timeline, and goals..."
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              className="w-full bg-black/10 dark:bg-black/45 border border-teal/20 rounded-2xl px-4 py-3 text-foam placeholder-mist/40 focus:outline-none focus:border-teal/60 focus:ring-1 focus:ring-teal/60 transition-all text-sm backdrop-blur-md resize-none"
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center rounded-full bg-teal px-6 py-3.5 font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg dark:text-abyss text-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      )}
    </div>
  )
}
