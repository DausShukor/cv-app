import React from 'react'
import './styles.css'

export const metadata = {
  description: 'CV of Ts. Muhammad Firdaus Bin Abdul Shukor — Full Stack AI Engineer.',
  title: 'Firdaus Shukor — CV',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-slate-100 text-slate-900 antialiased print:bg-white">
        <main>{children}</main>
      </body>
    </html>
  )
}
