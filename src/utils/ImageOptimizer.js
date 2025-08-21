import { createCanvas, loadImage } from 'canvas'
import fs from 'node:fs'
import tmp from 'tmp'

export async function maxResolution(url) {
    const response = await fetch(url)
    const buffer = await response.arrayBuffer()

    const img = await loadImage(buffer)

    const canvas = createCanvas(img.width * 2.5, img.height * 2.5)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    const bufferRes = canvas.toBuffer()
    return bufferRes
}
