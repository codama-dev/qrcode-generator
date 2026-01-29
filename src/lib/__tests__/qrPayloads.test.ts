import { describe, expect, it } from 'vitest'
import {
  generateBitcoinPayload,
  generateEmailPayload,
  generateFacebookPayload,
  generateInstagramPayload,
  generateLocationPayload,
  generatePhonePayload,
  generateSmsPayload,
  generateVCardPayload,
  generateWhatsappPayload,
  generateWifiPayload,
} from '../qrPayloads'

describe('qrPayloads', () => {
  it('generates WiFi payload', () => {
    const payload = generateWifiPayload({
      ssid: 'MyNetwork',
      password: 'secret',
      authType: 'WPA',
      hidden: false,
    })
    expect(payload).toBe('WIFI:T:WPA;S:MyNetwork;P:secret;H:false;;')
  })

  it('generates vCard payload', () => {
    const payload = generateVCardPayload({
      firstName: 'Ada',
      lastName: 'Lovelace',
      organization: 'Example Inc',
      title: 'Engineer',
      phone: '+123',
      phoneWork: '+456',
      email: 'home@example.com',
      emailWork: 'work@example.com',
      website: 'https://example.com',
      street: '1 Main St',
      city: 'City',
      state: 'ST',
      zip: '12345',
      country: 'Country',
      note: 'Important',
    })

    expect(payload).toContain('BEGIN:VCARD')
    expect(payload).toContain('VERSION:3.0')
    expect(payload).toContain('N:Lovelace;Ada;;;')
    expect(payload).toContain('FN:Ada Lovelace')
    expect(payload).toContain('ORG:Example Inc')
    expect(payload).toContain('TITLE:Engineer')
    expect(payload).toContain('TEL;TYPE=CELL:+123')
    expect(payload).toContain('TEL;TYPE=WORK:+456')
    expect(payload).toContain('EMAIL;TYPE=HOME:home@example.com')
    expect(payload).toContain('EMAIL;TYPE=WORK:work@example.com')
    expect(payload).toContain('URL:https://example.com')
    expect(payload).toContain('ADR;TYPE=HOME:;;1 Main St;City;ST;12345;Country')
    expect(payload).toContain('NOTE:Important')
    expect(payload).toContain('END:VCARD')
  })

  it('generates email payload', () => {
    const payload = generateEmailPayload({
      to: 'user@example.com',
      subject: 'Hello',
      body: 'World',
    })
    expect(payload).toBe('mailto:user@example.com?subject=Hello&body=World')
  })

  it('generates phone payload', () => {
    const payload = generatePhonePayload({ number: '+123456789' })
    expect(payload).toBe('tel:+123456789')
  })

  it('generates SMS payload', () => {
    const payload = generateSmsPayload({ number: '+123', message: 'Hi there' })
    expect(payload).toBe('sms:+123?body=Hi+there')
  })

  it('generates WhatsApp payload', () => {
    const payload = generateWhatsappPayload({ number: '+123', message: 'Hi there' })
    expect(payload).toBe('https://wa.me/%2B123?text=Hi+there')
  })

  it('generates Facebook payload', () => {
    const payload = generateFacebookPayload({ username: 'my-page' })
    expect(payload).toBe('https://facebook.com/my-page')
  })

  it('generates Instagram payload', () => {
    const payload = generateInstagramPayload({ username: 'handle' })
    expect(payload).toBe('https://instagram.com/handle')
  })

  it('generates Location payload', () => {
    const payload = generateLocationPayload({
      latitude: '40.7128',
      longitude: '-74.0060',
      label: 'NYC',
    })
    expect(payload).toBe('geo:40.7128,-74.0060?q=NYC')
  })

  it('generates Bitcoin payload', () => {
    const payload = generateBitcoinPayload({
      address: '1BoatSLRHtKNngkdXEeobR76b53LETtpyT',
      amount: '0.01',
      label: 'Donation',
      message: 'Thanks',
    })
    expect(payload).toBe(
      'bitcoin:1BoatSLRHtKNngkdXEeobR76b53LETtpyT?amount=0.01&label=Donation&message=Thanks'
    )
  })
})
