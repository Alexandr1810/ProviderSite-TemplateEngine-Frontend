import Header from '@/app/components/header/header';
import Footer from '@/app/components/footer/footer';

export default function BlogLayout({ children }) {
  return (
    <div className="main">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
