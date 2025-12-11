import '../styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '楓念的博客',
  description: '楓念的个人博客 - 分享二次元、技术、生活',
  icons: {
    icon: 'https://s1.imagehub.cc/images/2025/12/09/d0630008618c165c9bd3f9469d27dfc2.png',
    shortcut: 'https://s1.imagehub.cc/images/2025/12/09/d0630008618c165c9bd3f9469d27dfc2.png',
    apple: 'https://s1.imagehub.cc/images/2025/12/09/d0630008618c165c9bd3f9469d27dfc2.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* DNS 预解析（如果有外部资源） */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
