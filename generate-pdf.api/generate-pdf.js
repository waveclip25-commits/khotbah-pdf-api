import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        
          if (req.method === 'OPTIONS') {
              return res.status(200).end()
                }

                  const { html, css } = req.body

                    const browser = await puppeteer.launch({
                        args: chromium.args,
                            executablePath: await chromium.executablePath(),
                                headless: true
                                  })

                                    const page = await browser.newPage()

                                      await page.setContent(`
                                          <!DOCTYPE html>
                                              <html>
                                                    <head>
                                                            <meta charset="UTF-8">
                                                                    <link href="https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
                                                                            <style>
                                                                                      @page { size: A4; margin: 0; }
                                                                                                ${css}
                                                                                                        </style>
                                                                                                              </head>
                                                                                                                    <body>${html}</body>
                                                                                                                        </html>
                                                                                                                          `)

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