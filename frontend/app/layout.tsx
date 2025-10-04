import './globals.css'

export const metadata = {
  title: 'Sistema de Produtos',
  description: 'Cadastro e gerenciamento de produtos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}