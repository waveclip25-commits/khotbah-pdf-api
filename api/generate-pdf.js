import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { html, css, fonts = [] } = req.body

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true
    })

    const page = await browser.newPage()

    // whitelist font aman
    const allowedFonts = [
      'Inter',
      'Amiri',
      'Scheherazade New',
      'Lateef',
      'Noto Naskh Arabic',
      'Montserrat',
      'Outfit',
      'Plus Jakarta Sans',
      'Lora',
      'Figtree',
      'Merriweather',
      'Reem Kufi',
      'Cairo',
      'Playfair Display',
      'Almarai',
      'Aref Ruqaa',
      'Roboto',
      'Poppins',
      'Open Sans',
      'Libre Baskerville',
      'Cinzel',
      'Spectral',
      'Quicksand',
      'Space Grotesk',
      'JetBrains Mono'
    ]

    const safeFonts = fonts.filter(font =>
      allowedFonts.includes(font)
    )

    const googleFontQuery = safeFonts
      .map(font =>
        `family=${encodeURIComponent(font).replace(/%20/g, '+')}:wght@400;500;600;700`
      )
      .join('&')

    const googleFontsLink = googleFontQuery
      ? `https://fonts.googleapis.com/css2?${googleFontQuery}&display=swap`
      : ''

    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">

          ${
            googleFontsLink
              ? `<link href="${googleFontsLink}" rel="stylesheet">`
              : ''
          }

          <style>
            @page {
              size: A4;
              margin: 0;
            }

            ${css}
          </style>
        </head>

        <body>${html}</body>
      </html>
    `)

    // tunggu font benar-benar siap
    await page.evaluate(async () => {
      await document.fonts.ready
    })

    // buffer tambahan untuk font arab
    await new Promise(resolve => setTimeout(resolve, 2500))

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }
    })

    await browser.close()

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=khotbah.pdf'
    )

    res.status(200).send(pdf)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      error: 'PDF generation failed',
      details: error.message
    })
  }
      }
                                                                                                                            await page.evaluateHandle('document.fonts.ready')
                                                                                                                              await new Promise(r => setTimeout(r, 1500))

                                                                                                                                const pdf = await page.pdf({
                                                                                                                                    format: 'A4',
                                                                                                                                        printBackground: true,
                                                                                                                                            margin: { top: 0, right: 0, bottom: 0, left: 0 }
                                                                                                                                              })

                                                                                                                                                await browser.close()

                                                                                                                                                  res.setHeader('Content-Type', 'application/pdf')
                                                                                                                                                    res.setHeader('Content-Disposition', 'attachment; filename=khotbah.pdf')
                                                                                                                                                      res.send(pdf)
                                                                                                                                                      }
