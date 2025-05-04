/**
 * Simple QR Code encryption/decryption utility
 * Uses a combination of XOR cipher and Base64 encoding
 * Suitable for simple strings like bicycle serial numbers
 */

// Secret key for XOR encryption - can be any string
const SECRET_KEY = "IPBBikeCenter"

/**
 * Encrypts a string (nomorSeri) to be used in QR codes
 * @param text The text to encrypt (typically nomorSeri)
 * @returns Encrypted string (URL-safe base64)
 */
export function encryptQRData(text: string): string {
  try {
    // Add a timestamp to prevent identical QR codes for the same serial number
    const timestamp = Date.now().toString()
    const dataToEncrypt = `${text}|${timestamp}`

    // Simple XOR encryption
    let encrypted = xorEncrypt(dataToEncrypt, SECRET_KEY)

    // Add a simple checksum
    const checksum = calculateChecksum(encrypted)
    encrypted = `${encrypted}|${checksum}`

    // Convert to URL-safe base64
    return btoa(encrypted).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
  } catch (error) {
    console.error("Encryption error:", error)
    throw new Error("Failed to encrypt QR data")
  }
}

/**
 * Decrypts an encrypted string from a QR code
 * @param encryptedText The encrypted text (URL-safe base64)
 * @returns Original string (nomorSeri)
 */
export function decryptQRData(encryptedText: string): string {
  try {
    // Convert from URL-safe base64
    const base64 = encryptedText.replace(/-/g, "+").replace(/_/g, "/")

    // Add padding if needed
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

    // Decode base64
    const decoded = atob(paddedBase64)

    // Split the data and checksum
    const [encryptedData, checksum] = decoded.split("|")

    // Verify checksum
    if (calculateChecksum(encryptedData) !== checksum) {
      throw new Error("Invalid checksum - data may be corrupted")
    }

    // Decrypt using XOR
    const decrypted = xorEncrypt(encryptedData, SECRET_KEY)

    // Extract the original text (remove timestamp)
    const [originalText] = decrypted.split("|")

    return originalText
  } catch (error) {
    console.error("Decryption error:", error)
    throw new Error("Failed to decrypt QR data")
  }
}

/**
 * Validates if a QR code contains a valid encrypted nomorSeri
 * @param encryptedText The encrypted text from QR code
 * @param expectedNomorSeri The expected nomorSeri to match against
 * @returns Boolean indicating if the QR code is valid
 */
export function validateQRCode(encryptedText: string, expectedNomorSeri: string): boolean {
  try {
    const decrypted = decryptQRData(encryptedText)
    return decrypted === expectedNomorSeri
  } catch (error) {
    console.error("QR validation error:", error)
    return false
  }
}

/**
 * Simple XOR encryption/decryption
 * @param text Text to encrypt or decrypt
 * @param key Secret key
 * @returns Encrypted or decrypted text
 */
function xorEncrypt(text: string, key: string): string {
  let result = ""

  for (let i = 0; i < text.length; i++) {
    // XOR each character with the corresponding character in the key
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    result += String.fromCharCode(charCode)
  }

  return result
}

/**
 * Calculate a simple checksum for data validation
 * @param text Text to calculate checksum for
 * @returns Checksum string
 */
function calculateChecksum(text: string): string {
  let sum = 0

  // Sum the character codes
  for (let i = 0; i < text.length; i++) {
    sum += text.charCodeAt(i)
  }

  // Convert to base36 for a shorter representation
  return sum.toString(36)
}
