export default function BookingsLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">{children}</div>
      </div>
    )
  }