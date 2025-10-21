import numeral from 'numeral'

export const baseURL = () => (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : '')

export const isInteger = (value: string): boolean => {
  const typeInt = /^[-]?[0-9]+$/
  return typeInt.test(value)
}

export const isNumeric = (value: string): boolean => {
  const typeFloat = /^[-]?[0-9]+\.[0-9]+$/
  return typeFloat.test(value) || isInteger(value)
}

export const isNumericPositive = (value: string): boolean => {
  const typeFloat = /^[0-9]+\.[0-9]+$/
  const typeInt = /^[0-9]+$/
  return typeFloat.test(value) || typeInt.test(value)
}

export const makeHash = (longitud: number = 32): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$!@'
  let hash = ''

  for (let i = 0; i < longitud; i++) {
    hash += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  return hash
}

export function formatNumeric(amount: number) {
  return new Intl.NumberFormat('en-US').format(amount)
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
}

export function formatDate(dateStr: string): string {
  const dateObj = new Date(dateStr)
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('es-ES', options).format(dateObj)
}

export function formatDateShort(dateStr: string): string {
  const date = dateStr.split('-')
  return date.reverse().join('/')
}

export function removeFormatNumeric(input: string): string {
  return input.toString().replace(/[$,*%\s ]*/g, '')
}

export function decimales(longitud: number): string {
  let digitos = ''
  for (let i = 0; i < longitud; i++) {
    digitos += '0'
  }
  return digitos
}

export function numberFormat(value: number, decimalesNum: number = 2): number {
  return numeral(numeral(value).format(`0.${decimales(decimalesNum)}`)).value()!
}

export function clone(obj: object): object {
  return JSON.parse(JSON.stringify(obj))
}

export const isKeySpecial = (key: string): boolean => {
  const keysSpecials = [
    'Backspace',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'ArrowDown',
    'Delete',
    'Tab',
  ]
  return keysSpecials.includes(key)
}

export const isKeyCtrl = (e: KeyboardEvent): boolean => {
  const keysSpecials = ['c', 'v', 'x', 'a']
  return keysSpecials.includes(e.key) && (e.ctrlKey || e.metaKey)
}
