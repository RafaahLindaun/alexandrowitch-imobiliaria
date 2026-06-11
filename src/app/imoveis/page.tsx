import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import PropertyCard from "../../components/PropertyCard";
import { properties } from "../../data/properties";

export default function PropertiesPage() {
  return (
    <main className="page">
      <Navbar />
      <section className="pageTop">
        <div className="container">
          <h1>Imóveis</h1>
          <p>Confira oportunidades selecionadas em São Roque e região para venda e locação.</p>
        </div>
      </section>
      <section className="section sectionLight">
        <div className="container">
          <div className="grid3">
            {properties.map((property) => <PropertyCard key={property.id} property={property} />)}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
